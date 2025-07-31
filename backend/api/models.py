from django.db import models
from django.utils import timezone
from datetime import date
from dateutil.relativedelta import relativedelta
from django.db import models
import datetime


# --------------------- UTILISATEURS ---------------------
class LocalUser(models.Model):
    ROLE_CHOICES = [
        ('admin', 'Administrateur'),
        ('user', 'Utilisateur'),
        ('gestionnaire', 'Gestionnaire'),
        ('mecanicien', 'Mécanicien'),
    ]
    username = models.CharField(max_length=150, unique=True, null=True, blank=True)
    email = models.EmailField(unique=True, null=True, blank=True)
    first_name = models.CharField(max_length=30, blank=True, null=True)
    last_name = models.CharField(max_length=150, blank=True, null=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='user')
    keycloak_id = models.CharField(max_length=100, unique=True, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


# --------------------- ENTITÉS DE BASE ---------------------
class Categorie(models.Model):
    idcat = models.AutoField(primary_key=True)
    code_cat = models.CharField(max_length=50)

class Proprietaire(models.Model):
    idpro = models.AutoField(primary_key=True)
    nom = models.CharField(max_length=100)
    adresse = models.CharField(max_length=100)
    commune = models.CharField(max_length=150)
    profession = models.CharField(max_length=60)
    tel = models.CharField(max_length=20)
    email = models.EmailField(max_length=100, null=True, blank=True)

class Marque(models.Model):
    idmar = models.AutoField(primary_key=True)
    nom_mar = models.CharField(max_length=70)
    lettre = models.CharField(max_length=1, null=True, blank=True)

class Modele(models.Model):
    idmod = models.AutoField(primary_key=True)
    nom_mod = models.CharField(max_length=70)
    idmar = models.ForeignKey(Marque, on_delete=models.CASCADE)

class Carosserie(models.Model):
    idcar = models.AutoField(primary_key=True)
    code_car = models.CharField(max_length=60)

class Carburant(models.Model):
    idcarb = models.AutoField(primary_key=True)
    type_carb = models.CharField(max_length=50)


# --------------------- VÉHICULE ---------------------
class Vehicule(models.Model):
    idveh = models.AutoField(primary_key=True)
    num_imm = models.CharField(max_length=10)
    idmod = models.ForeignKey(Modele, on_delete=models.CASCADE)
    idpro = models.ForeignKey(Proprietaire, on_delete=models.CASCADE)
    idcarb = models.ForeignKey(Carburant, on_delete=models.CASCADE)
    idcar = models.ForeignKey(Carosserie, on_delete=models.CASCADE)
    idmar = models.ForeignKey(Marque, on_delete=models.CASCADE, null=True, blank=True)
    idcat = models.ForeignKey(Categorie, on_delete=models.CASCADE, null=True, blank=True)
    num_serie = models.CharField(max_length=20)
    num_moteur = models.CharField(max_length=20)
    puissance = models.IntegerField()
    places = models.IntegerField()
    poids_ch = models.IntegerField()
    poids_vide = models.IntegerField()
    date_circulation = models.DateField()
    date_immatriculation = models.DateField()
    date_emission = models.DateField()
    annee = models.IntegerField()
    charge_utile = models.DecimalField(max_digits=6, decimal_places=2)
    type = models.CharField(max_length=20)
    cylindre=models.CharField(max_length=40)
    image = models.TextField(blank=True, null=True)

    def kilometrage_total(self):
        from django.db.models import Sum
        total = self.trajets.aggregate(Sum('distance'))['distance__sum']
        return total or 0


# --------------------- ASSURANCE ---------------------
class Assurance(models.Model):
    idass = models.AutoField(primary_key=True)
    nom_ass = models.CharField(max_length=50)
    code_ass = models.CharField(max_length=10)

class Agence(models.Model):
    idag = models.AutoField(primary_key=True)
    idass = models.ForeignKey(Assurance, on_delete=models.CASCADE)
    nom_ag = models.CharField(max_length=100)
    adresse = models.CharField(max_length=200)

class Police(models.Model):
    TYPE_ASSURANCE = [
        ('obligatoire', 'Obligatoire'),
        ('tiers', 'Responsabilité civile'),
        ('tous_risques', 'Tous risques'),
    ]
    num_police = models.CharField(max_length=20, primary_key=True)
    idag = models.ForeignKey(Agence, on_delete=models.CASCADE)
    idveh = models.ForeignKey(Vehicule, on_delete=models.CASCADE)
    type_assurance = models.CharField(max_length=20, choices=TYPE_ASSURANCE)
    date_delivrance = models.DateField()
    date_debut = models.DateField()
    date_fin = models.DateField()
    statut_pol = models.CharField(max_length=20)

class Cotisation(models.Model):
    idcot = models.AutoField(primary_key=True)
    num_police = models.ForeignKey(Police, on_delete=models.CASCADE)
    mtt_cot = models.DecimalField(max_digits=10, decimal_places=2)
    mtt_cp = models.DecimalField(max_digits=10, decimal_places=2)
    mtt_de = models.DecimalField(max_digits=10, decimal_places=2)
    mtt_ca = models.DecimalField(max_digits=10, decimal_places=2)
    mtt_div = models.DecimalField(max_digits=10, decimal_places=2)
    mtt_total = models.DecimalField(max_digits=10, decimal_places=2)
    date_cot = models.DateField()
    date_debut_couverture = models.DateField()
    date_fin_couverture = models.DateField()
    statut_paiement = models.CharField(
        max_length=20,
        choices=[('payé', 'Payé'), ('en attente', 'En attente'), ('retard', 'Retard')],
        default='en attente'
    )
    type_cotisation = models.CharField(
        max_length=20,
        choices=[('mensuelle', 'Mensuelle'), ('trimestrielle', 'Trimestrielle'), ('annuelle', 'Annuelle')],
        default='annuelle'
    )

class Sinistre(models.Model):
    idsin = models.AutoField(primary_key=True)
    num_police = models.ForeignKey(Police, on_delete=models.CASCADE)
    date_sinistre = models.DateField()
    description = models.TextField()
    montant_rembourse = models.DecimalField(max_digits=10, decimal_places=2)


# --------------------- CONTRÔLE TECHNIQUE ---------------------
class Centrevisite(models.Model):
    idcentre = models.AutoField(primary_key=True)
    nom_centre = models.CharField(max_length=100)
    adresse = models.CharField(max_length=200)

class Operateur(models.Model):
    idoper = models.AutoField(primary_key=True)
    idcentre = models.ForeignKey(Centrevisite, on_delete=models.CASCADE)
    nom_oper = models.CharField(max_length=100)

class Controle(models.Model):
    idcont = models.AutoField(primary_key=True)
    idveh = models.ForeignKey(Vehicule, on_delete=models.CASCADE)
    idoper = models.ForeignKey(Operateur, on_delete=models.CASCADE)
    date_visite = models.DateField()
    date_valid = models.DateField()
    pv_num = models.CharField(max_length=20)
    aptitude = models.CharField(max_length=20)
    date_delivrance_c = models.DateField()
    frequence_mois = models.IntegerField(default=12)
    est_valide = models.BooleanField(default=True)

    def prochaine_visite(self):
        return self.date_valid + relativedelta(months=self.frequence_mois)

    def verifier_validite(self):
        self.est_valide = self.date_valid >= date.today()

class Carteviolette(models.Model):
    idcarte = models.AutoField(primary_key=True)
    idcont = models.ForeignKey(Controle, on_delete=models.CASCADE)
    date_delivrance = models.DateField()
    num_carte = models.CharField(max_length=20)

class Recucontrole(models.Model):
    idrec = models.AutoField(primary_key=True)
    idcont = models.ForeignKey(Controle, on_delete=models.CASCADE)
    date_rec = models.DateField()
    num_rec = models.CharField(max_length=20)
    mtt_droit = models.DecimalField(max_digits=10, decimal_places=2)
    mtt_pv = models.DecimalField(max_digits=10, decimal_places=2)
    mtt_carte = models.DecimalField(max_digits=10, decimal_places=2)
    mtt_tht = models.DecimalField(max_digits=10, decimal_places=2)
    mtt_tva = models.DecimalField(max_digits=10, decimal_places=2)
    mtt_total = models.DecimalField(max_digits=10, decimal_places=2)


# --------------------- TRAJET & ENTRETIEN ---------------------
class Trajet(models.Model):
    idtraj = models.AutoField(primary_key=True)
    idveh = models.ForeignKey('Vehicule', on_delete=models.CASCADE, related_name='trajets')

    date_sortie = models.DateField()
    date_arriver = models.DateField(default=datetime.date.today)
    heure_depart = models.TimeField(null=True, blank=True)
    heure_arrivee = models.TimeField(null=True, blank=True)

    point_depart = models.CharField(max_length=200, blank=True, null=True)
    destination = models.CharField(max_length=200)

    kilometrage_depart = models.DecimalField(max_digits=10, decimal_places=2)  # km au départ
    kilometrage_arrivee = models.DecimalField(max_digits=10, decimal_places=2)  # km à l'arrivée
    distance = models.DecimalField(max_digits=10, decimal_places=2, editable=False)  # calculée automatiquement
    distance_cumulative = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)  # distance cumulée

    def save(self, *args, **kwargs):
        self.distance = self.kilometrage_arrivee - self.kilometrage_depart
        super().save(*args, **kwargs)
        total_km = Trajet.objects.filter(idveh=self.idveh).aggregate(total=models.Sum('distance'))['total'] or 0
        self.distance_cumulative = total_km
        super().save(update_fields=['distance_cumulative'])

class StationService(models.Model):
    idstation = models.AutoField(primary_key=True)
    nom_station = models.CharField(max_length=100)
    localisation = models.CharField(max_length=200)

class Ravitailler(models.Model):
    idveh = models.ForeignKey(Vehicule, on_delete=models.CASCADE)
    idstation = models.ForeignKey(StationService, on_delete=models.CASCADE)
    idcarb = models.ForeignKey(Carburant, on_delete=models.CASCADE)
    date_ravitaillement = models.DateField()
    qtte_litre = models.DecimalField(max_digits=5, decimal_places=2)
    prix_unitaire = models.DecimalField(max_digits=6, decimal_places=2)
    montant = models.DecimalField(max_digits=8, decimal_places=2)

class vidange(models.Model):
    idvid = models.AutoField(primary_key=True)
    idveh = models.ForeignKey(Vehicule, on_delete=models.CASCADE)
    date_vidange = models.DateField()
    type_huile = models.CharField(max_length=50)
    qtte_huile = models.DecimalField(max_digits=5, decimal_places=2)
    prix_u_vidange = models.DecimalField(max_digits=6, decimal_places=2)
    cout = models.DecimalField(max_digits=8, decimal_places=2)

# --------------------- RÉPARATION ---------------------
class Piece(models.Model):
    idpiece = models.AutoField(primary_key=True)
    nom_piece = models.CharField(max_length=100)
    description = models.TextField(null=True, blank=True)
    prix_unitaire = models.DecimalField(max_digits=8, decimal_places=2)
    quantite_stock = models.IntegerField(default=0)

class reparation(models.Model):
    idrep = models.AutoField(primary_key=True)
    idveh = models.ForeignKey(Vehicule, on_delete=models.CASCADE)
    date_reparation = models.DateField()
    description = models.TextField(null=True, blank=True)
    type_repar=models.CharField(max_length=100)
    cout_main_oeuvre = models.DecimalField(max_digits=8, decimal_places=2, default=0.00)
    garge=models.CharField(max_length=200)

    def cout_total(self):
        total_pieces = sum([item.cout_piece() for item in self.details.all()])
        return total_pieces + self.cout_main_oeuvre

class DetailReparation(models.Model):
    iddetail = models.AutoField(primary_key=True)
    reparation = models.ForeignKey(reparation, on_delete=models.CASCADE, related_name='details')
    piece = models.ForeignKey(Piece, on_delete=models.CASCADE)
    quantite = models.IntegerField()

def cout_piece(self):
    return self.piece.prix_unitaire * self.quantite

def save(self, *args, **kwargs):
    if self.pk is None:
        self.piece.quantite_stock -= self.quantite
        self.piece.save()
    super().save(*args, **kwargs)

def __str__(self):
    return f"{self.quantite} x {self.piece.nom_piece}"
