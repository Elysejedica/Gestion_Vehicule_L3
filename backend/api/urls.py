from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    hello_api, register, login,
    ProprietaireViewSet, MarqueViewSet, VehiculeViewSet, CarosserieViewSet,
    CarburantViewSet, DetailReparationViewSet, CategorieViewSet, AgenceViewSet,
    AssuranceViewSet, CartevioletteViewSet, VidangeViewSet, PieceViewSet,
    PoliceViewSet, ModeleViewSet, TrajetViewSet, CentrevisiteViewSet,
    ControleViewSet, CotisationViewSet, OperateurViewSet, RavitaillerViewSet,
    reparationViewSet, RecucontroleViewSet, StationServiceViewSet, SinistreViewSet
)

router = DefaultRouter()
router.register(r'proprietaires', ProprietaireViewSet)
router.register(r'marques', MarqueViewSet)
router.register(r'vehicules', VehiculeViewSet)
router.register(r'carrosseries', CarosserieViewSet)
router.register(r'carburants', CarburantViewSet)
router.register(r'categories', CategorieViewSet)
router.register(r'agences', AgenceViewSet)
router.register(r'assurances', AssuranceViewSet)
router.register(r'carteviolettes', CartevioletteViewSet)
router.register(r'vidanges', VidangeViewSet)
router.register(r'pieces', PieceViewSet)
router.register(r'polices', PoliceViewSet)
router.register(r'modeles', ModeleViewSet)
router.register(r'trajets', TrajetViewSet)
router.register(r'centresvisites', CentrevisiteViewSet)
router.register(r'controles', ControleViewSet)
router.register(r'cotisations', CotisationViewSet)
router.register(r'operateurs', OperateurViewSet)
router.register(r'ravitaillers', RavitaillerViewSet)
router.register(r'reparations', reparationViewSet)
router.register(r'recucontroles', RecucontroleViewSet)
router.register(r'stationservices', StationServiceViewSet)
router.register(r'detailreparations', DetailReparationViewSet)
router.register(r'sinistres', SinistreViewSet)

urlpatterns = [
    path('auth/register/', register),
    path('auth/login/', login),
    path('hello/', hello_api),
    path('', include(router.urls)),  # inclut toutes les routes ViewSet automatiquement
]
