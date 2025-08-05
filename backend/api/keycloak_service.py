import requests
from keycloak import KeycloakAdmin, KeycloakOpenID
from django.conf import settings
import logging
logger = logging.getLogger(__name__)

class KeycloakService:
    def __init__(self):
        self.config = settings.KEYCLOAK_CONFIG
        logger.info(f"Initializing KeycloakAdmin with server_url: {self.config['SERVER_URL']}, realm_name: {self.config['REALM_NAME']}")
        try:
            self.admin = KeycloakAdmin(
                server_url=self.config['SERVER_URL'],
                username=self.config['ADMIN_USERNAME'],
                password=self.config['ADMIN_PASSWORD'],
                realm_name=self.config['REALM_NAME'],
                client_id=self.config['ADMIN_CLIENT_ID'],
                verify=True
            )
            self.openid = KeycloakOpenID(
                server_url=self.config['SERVER_URL'],
                client_id=self.config['CLIENT_ID'],
                realm_name=self.config['REALM_NAME'],
                client_secret_key=self.config['CLIENT_SECRET']
            )
            logger.info("KeycloakAdmin initialized successfully")
        except Exception as e:
            logger.error(f"Error initializing KeycloakAdmin: {str(e)}")
            raise
    
    def create_user(self, username, email, password, first_name, last_name, role):
        try:
            user_data = {
                'username': username,
                'email': email,
                'firstName': first_name,
                'lastName': last_name,
                'emailVerified': True,
                'enabled': True,
                'credentials': [{
                    'type': 'password',
                    'value': password,
                    'temporary': False
                }]
            }
            user_id = self.admin.create_user(user_data)

            # Tentative de récupération du rôle
            try:
                role_obj = self.admin.get_realm_role(role)
            except Exception as e:
                raise Exception(f"Rôle '{role}' introuvable dans Keycloak : {str(e)}")

            self.admin.assign_realm_roles(user_id, [role_obj])

            return user_id
        
        except Exception as e:
            error_message = f"Erreur lors de la création de l'utilisateur : {str(e)}"
            if hasattr(e, 'response'):
                error_message += f"\nStatus code: {e.response.status_code}"
                error_message += f"\nResponse content: {e.response.content}"
            logger.error(error_message)
            raise Exception(error_message)
    
    def authenticate_user(self, username, password):
        try:
            token = self.openid.token(username, password)
            return token
        except Exception as e:
            logger.error(f"Erreur lors de l'authentification : {str(e)}")
            raise Exception(f"Erreur lors de l'authentification : {str(e)}")


    def verify_token(self, token):
        try:
            token_info = self.openid.introspect(token)
            if token_info.get('active'):
                return token_info
            else:
                raise Exception("Token invalide")
        except Exception as e:
            raise Exception(f"Erreur lors de la vérification du token : {str(e)}")
        
    def get_user_info(self, token):
        try:
            user_info = self.openid.userinfo(token)
            return user_info
        except Exception as e:
            raise Exception(f"Erreur lors de la récupération des informations utilisateur : {str(e)}")
    
    def get_all_users(self):
        url = f"{self.config['SERVER_URL']}/admin/realms/{self.config['REALM_NAME']}/users"
        headers = {
            "Authorization": f"Bearer {self.get_admin_token()}",
            "Content-Type": "application/json"
        }
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        return response.json()

    def get_admin_token(self):
        # Méthode pour récupérer un token admin Keycloak
        data = {
            "grant_type": "password",
            "client_id": "admin-cli",
            "username": "superadmin",  # à adapter
            "password": "admin123",  # à adapter
        }
        url = f"{self.config['SERVER_URL']}/realms/{self.config['REALM_NAME']}/protocol/openid-connect/token"
        response = requests.post(url, data=data)
        response.raise_for_status()
        return response.json()["access_token"]
