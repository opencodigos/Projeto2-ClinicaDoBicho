from rest_framework import viewsets
from core.models import Cliente, Animal, MedicoVeterinario, Consulta
from .serializers import (ClienteSerializer, 
                          AnimalSerializer,     
                          MedicoVeterinarioSerializer, 
                          ConsultaSerializer) 

class ClienteViewSet(viewsets.ModelViewSet):
    queryset = Cliente.objects.all()
    serializer_class = ClienteSerializer

class AnimalViewSet(viewsets.ModelViewSet):
    queryset = Animal.objects.all()
    serializer_class = AnimalSerializer

class MedicoVeterinarioViewSet(viewsets.ModelViewSet):
    queryset = MedicoVeterinario.objects.all()
    serializer_class = MedicoVeterinarioSerializer

class ConsultaViewSet(viewsets.ModelViewSet):
    queryset = Consulta.objects.all()
    serializer_class = ConsultaSerializer
