from rest_framework.authentication import BaseAuthentication
from rest_framework import exceptions
from api.keycloak_service import KeycloakService
from api.models import LocalUser

class KeycloakAuthentication(BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.META.get('HTTP_AUTHORIZATION', '')

        if not auth_header or not auth_header.startswith('Bearer '):
            return None

        token = auth_header.split(' ')[1]
        keycloak = KeycloakService()

        try:
            token_info = keycloak.verify_token(token)
            user_info = keycloak.get_user_info(token)

            user, created = LocalUser.objects.get_or_create(
                idpro=user_info['sub'],
                defaults={
                    'email': user_info.get('email', ''),
                    'first_name': user_info.get('given_name', ''),
                    'last_name': user_info.get('family_name', ''),
                }
            )

            return (user, token)
        except Exception:
            raise exceptions.AuthenticationFailed('Token invalide ou expiré')
