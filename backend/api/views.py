from django.shortcuts import render
import requests 
from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from django.http import JsonResponse
import logging

from api.keycloak_service import KeycloakService
from .serializers import (
    UserSerializer,
    PieceSerializer,
    TrajetSerializer,
    CentrevisiteSerializer,
    reparationSerializer,
    RecucontroleSerializer,
    StationServiceSerializer,
    PoliceSerializer,
    OperateurSerializer,
    RavitaillerSerializer,
    ControleSerializer,
    CotisationSerializer,
    CarburantSerializer,
    CarosserieSerializer,
    AgenceSerializer,
    AssuranceSerializer,
    MarqueSerializer,
    ModeleSerializer,
    ProprietaireSerializer,
    VehiculeSerializer,
    CartevioletteSerializer,
    vidangeSerializer,
    CategorieSerializer,
    DetailReparationSerializer,
    SinistreSerializer
)
from .models import (
    Proprietaire, Marque, Vehicule, Carosserie, Carburant, Categorie, Agence,
    Assurance, Carteviolette, vidange, Piece, Police, Modele, DetailReparation, Sinistre,
    Trajet, Centrevisite, Controle, Cotisation, Operateur, Ravitailler, reparation,
    Recucontrole, StationService, LocalUser
)

keycloak_service = KeycloakService()
logger = logging.getLogger(__name__)


def hello_api(request):
    return JsonResponse({"message": "Bonjour depuis l'API Django"})


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    try:
        data = request.data
        logger.info(f"Attempting to register user: {data.get('username')}")

        required_fields = ['username', 'email', 'password', 'first_name', 'last_name', 'role']
        for field in required_fields:
            if field not in data:
                return Response({"error": f"Le champ {field} est requis."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            keycloak_id = keycloak_service.create_user(
                username=data['username'],
                email=data['email'],
                password=data['password'],
                first_name=data['first_name'],
                last_name=data['last_name'],
                role=data['role']
            )
            logger.info(f"User created in Keycloak with ID: {keycloak_id}")
        except requests.exceptions.HTTPError as e:
            if e.response.status_code == 403:
                return Response({"error": "Accès refusé à Keycloak."}, status=status.HTTP_403_FORBIDDEN)
            return Response({"error": f"Erreur Keycloak: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            return Response({"error": f"Erreur inattendue Keycloak: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        try:
            local_user = LocalUser.objects.create(
                username=data['username'],
                email=data['email'],
                first_name=data['first_name'],
                last_name=data['last_name'],
                keycloak_id=keycloak_id,
                role=data['role']
            )
        except Exception as e:
            return Response({"error": f"Erreur création utilisateur local: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({
            "message": "Utilisateur créé avec succès.",
            "user": UserSerializer(local_user).data
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({"error": f"Erreur inattendue lors de l'inscription: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    try:
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response({"error": "Username et mot de passe sont requis."}, status=status.HTTP_400_BAD_REQUEST)

        token_data = keycloak_service.authenticate_user(username, password)
        user_info = keycloak_service.get_user_info(token_data['access_token'])

        user, created = LocalUser.objects.get_or_create(
            keycloak_id=user_info['sub'],
            defaults={
                'email': user_info.get('email', ''),
                'first_name': user_info.get('given_name', ''),
                'last_name': user_info.get('family_name', ''),
                'keycloak_id': user_info['sub'],
            }
        )

        return Response({
            'token': token_data['access_token'],
            'refresh_token': token_data['refresh_token'],
            'user': UserSerializer(user).data
        }, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def get_distance_cumulee(request, id_vehicule):
    trajets = Trajet.objects.filter(id_vehicule=id_vehicule)
    total = sum([t.distance for t in trajets])
    return Response({'total': total})


class ProprietaireViewSet(viewsets.ModelViewSet):
    queryset = Proprietaire.objects.all()
    serializer_class = ProprietaireSerializer

class MarqueViewSet(viewsets.ModelViewSet):
    queryset = Marque.objects.all()
    serializer_class = MarqueSerializer

class VehiculeViewSet(viewsets.ModelViewSet):
    queryset = Vehicule.objects.all()
    serializer_class = VehiculeSerializer

class CarosserieViewSet(viewsets.ModelViewSet):
    queryset = Carosserie.objects.all()
    serializer_class = CarosserieSerializer

class CarburantViewSet(viewsets.ModelViewSet):
    queryset = Carburant.objects.all()
    serializer_class = CarburantSerializer

class CategorieViewSet(viewsets.ModelViewSet):
    queryset = Categorie.objects.all()
    serializer_class = CategorieSerializer

class AgenceViewSet(viewsets.ModelViewSet):
    queryset = Agence.objects.all()
    serializer_class = AgenceSerializer

class AssuranceViewSet(viewsets.ModelViewSet):
    queryset = Assurance.objects.all()
    serializer_class = AssuranceSerializer

class CartevioletteViewSet(viewsets.ModelViewSet):
    queryset = Carteviolette.objects.all()
    serializer_class = CartevioletteSerializer

class VidangeViewSet(viewsets.ModelViewSet):
    queryset = vidange.objects.all()
    serializer_class = vidangeSerializer

class PieceViewSet(viewsets.ModelViewSet):
    queryset = Piece.objects.all()
    serializer_class = PieceSerializer

class PoliceViewSet(viewsets.ModelViewSet):
    queryset = Police.objects.all()
    serializer_class = PoliceSerializer

class ModeleViewSet(viewsets.ModelViewSet):
    queryset = Modele.objects.all()
    serializer_class = ModeleSerializer

class TrajetViewSet(viewsets.ModelViewSet):
    queryset = Trajet.objects.all()
    serializer_class = TrajetSerializer

class CentrevisiteViewSet(viewsets.ModelViewSet):
    queryset = Centrevisite.objects.all()
    serializer_class = CentrevisiteSerializer

class ControleViewSet(viewsets.ModelViewSet):
    queryset = Controle.objects.all()
    serializer_class = ControleSerializer

class CotisationViewSet(viewsets.ModelViewSet):
    queryset = Cotisation.objects.all()
    serializer_class = CotisationSerializer

class OperateurViewSet(viewsets.ModelViewSet):
    queryset = Operateur.objects.all()
    serializer_class = OperateurSerializer

class RavitaillerViewSet(viewsets.ModelViewSet):
    queryset = Ravitailler.objects.all()
    serializer_class = RavitaillerSerializer

class reparationViewSet(viewsets.ModelViewSet):
    queryset = reparation.objects.all()
    serializer_class = reparationSerializer

class RecucontroleViewSet(viewsets.ModelViewSet):
    queryset = Recucontrole.objects.all()
    serializer_class = RecucontroleSerializer

class StationServiceViewSet(viewsets.ModelViewSet):
    queryset = StationService.objects.all()
    serializer_class = StationServiceSerializer

class DetailReparationViewSet(viewsets.ModelViewSet):
    queryset = DetailReparation.objects.all()
    serializer_class = DetailReparationSerializer

class SinistreViewSet(viewsets.ModelViewSet):
    queryset = Sinistre.objects.all()
    serializer_class = SinistreSerializer
