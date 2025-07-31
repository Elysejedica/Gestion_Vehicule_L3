from rest_framework import viewsets
from .models import Proprietaire, Marque, Vehicule, Carosserie, Carburant, Categorie, Agence
from .models import Assurance, Carteviolette, vidange, Piece,Police, Modele,DetailReparation, Sinistre
from .models import Trajet, Centrevisite, Controle, Cotisation, Operateur, Ravitailler, reparation, Recucontrole, StationService
from rest_framework.permissions import AllowAny
from .serializers import (
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
    PieceSerializer,
    vidangeSerializer,
    CategorieSerializer,
    DetailReparationSerializer,
    SinistreSerializer
)

# views.py
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Trajet

@api_view(['GET'])
def get_distance_cumulee(request, id_vehicule):
    trajets = Trajet.objects.filter(id_vehicule=id_vehicule)
    total = sum([t.distance for t in trajets])
    return Response({'total': total})


class ProprietaireViewSet(viewsets.ModelViewSet):
    queryset = Proprietaire.objects.all()
    serializer_class = ProprietaireSerializer  # Allow any user to access this view

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

class CarburantViewSet(viewsets.ModelViewSet):
        queryset = Carburant.objects.all()
        serializer_class = CarburantSerializer


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