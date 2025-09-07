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

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Animal.objects.all()
        return Animal.objects.filter(dono__usuario=user)


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
    
    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Consulta.objects.all()
        return Consulta.objects.filter(animal__dono__usuario=user)
        