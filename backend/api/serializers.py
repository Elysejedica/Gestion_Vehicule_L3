from rest_framework import serializers
from .models import LocalUser,Marque,Vehicule,Carosserie,Carburant,Carteviolette,Categorie,vidange,Piece,Police, Modele,Agence,Assurance
from .models import Trajet,Centrevisite,Controle,Cotisation,Operateur,Ravitailler,reparation,Recucontrole,StationService,DetailReparation,Sinistre
from .models import LocalUser

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = LocalUser
        fields = '__all__'

class LocalUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = LocalUser
        fields = '__all__'

class MarqueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Marque
        fields = '__all__'

from rest_framework import serializers

from rest_framework import serializers
from .models import Vehicule

class VehiculeSerializer(serializers.ModelSerializer):
    historique_km = serializers.SerializerMethodField()

    class Meta:
        model = Vehicule
        fields = '__all__'

    def get_historique_km(self, obj):
        return obj.kilometrage_total()




class CarosserieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Carosserie
        fields = '__all__'


class CartevioletteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Carteviolette
        fields = '__all__'

class CategorieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categorie
        fields = '__all__'

class vidangeSerializer(serializers.ModelSerializer):
    class Meta:
        model = vidange
        fields = '__all__'


class PieceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Piece
        fields = '__all__'

class CarburantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Carburant
        fields = '__all__'

class AgenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Agence
        fields = '__all__'

class AssuranceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assurance
        fields = '__all__'


class PoliceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Police
        fields = '__all__'

class TrajetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trajet
        fields = '__all__'

class CentrevisiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Centrevisite
        fields = '__all__'

class ControleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Controle
        fields = '__all__'

class CotisationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cotisation
        fields = '__all__'

class OperateurSerializer(serializers.ModelSerializer):
    class Meta:
        model = Operateur
        fields = '__all__'

class RavitaillerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ravitailler
        fields = '__all__'

class StationServiceSerializer(serializers.ModelSerializer):    
    class Meta:
        model = StationService
        fields = '__all__'

class RecucontroleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recucontrole
        fields = '__all__'

class reparationSerializer(serializers.ModelSerializer):
    class Meta:
        model = reparation
        fields = '__all__'

class ModeleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Modele
        fields = '__all__'
        
class DetailReparationSerializer(serializers.ModelSerializer):
    class Meta:
        model = DetailReparation
        fields = '__all__'
class SinistreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sinistre
        fields = '__all__'