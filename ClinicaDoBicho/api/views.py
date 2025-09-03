from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from core.models import Cliente, Animal, MedicoVeterinario, Consulta
from .serializers import (ClienteSerializer, 
                          AnimalSerializer,     
                          MedicoVeterinarioSerializer, 
                          ConsultaSerializer,
                          ) 

class ClienteViewSet(viewsets.ModelViewSet):
    queryset = Cliente.objects.all()
    serializer_class = ClienteSerializer
    permission_classes = [IsAuthenticated]
    

class AnimalViewSet(viewsets.ModelViewSet):
    queryset = Animal.objects.all()
    serializer_class = AnimalSerializer
    permission_classes = [IsAuthenticated]


class MedicoVeterinarioViewSet(viewsets.ModelViewSet):
    queryset = MedicoVeterinario.objects.all()
    serializer_class = MedicoVeterinarioSerializer
    permission_classes = [IsAuthenticated]


class ConsultaViewSet(viewsets.ModelViewSet):
    queryset = Consulta.objects.all()
    serializer_class = ConsultaSerializer 
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action == 'create':
            return ConsultaAddSerializer
        return ConsultaSerializer