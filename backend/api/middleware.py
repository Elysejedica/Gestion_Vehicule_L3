from django.http import JsonResponse
from django.contrib.auth.models import AnonymousUser
from api.keycloak_service import KeycloakService
from .models import LocalUser

class KeycloakMiddleware:
    """
    Middleware to handle Keycloak authentication and user management.
    """

    def __init__(self, get_response):
        self.get_response = get_response
        self.keycloak_service = KeycloakService()

    def __call__(self, request):
        if request.path.startswith('/api/') and not request.path.startswith('/api/auth/'):
            auth_header = request.META.get('HTTP_AUTHORIZATION')

            if auth_header and auth_header.startswith('Bearer '):
                token = auth_header.split(' ')[1]
                try:
                    token_info = self.keycloak_service.verify_token(token)
                    user_info = self.keycloak_service.get_user_info(token)

                    #creer ou recuperer l'utilisateur local
                    user, created = LocalUser.objects.get_or_create(
                        username=user_info['preferred_username'],
                        defaults={
                            'email': user_info.get('email', ''),
                            'first_name': user_info.get('given_name', ''),
                            'last_name': user_info.get('family_name', ''),
                            'idpro': user_info['sub'],
                            'role': token_info.get('realm_access', {}).get('roles', ['utilisateur'])[0]
                        }
                    )
                    request.user = user
                    request.token_info = token_info
                except Exception as e:
                    return JsonResponse({'error': 'Token invalide ou expiré'}, status=401)
            else:
                return JsonResponse({'error': 'Token manquant'}, status=401)  
            
        response = self.get_response(request)
        return response