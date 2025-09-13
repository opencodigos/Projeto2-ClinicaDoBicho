from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from core.models import Cliente, Animal, MedicoVeterinario, Consulta
from rest_framework.response import Response
from rest_framework.decorators import action

from .serializers import (ClienteSerializer, 
                          AnimalSerializer,     
                          MedicoVeterinarioSerializer, 
                          ConsultaAddSerializer,
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
        
    @action(detail=False)
    def resumo_consultas(self, request):
        qs = self.get_queryset()

        resumo = {
            "todas": qs.count(), # 4 
            "agendadas": qs.filter(status='Agendada').count(), # 5
            "concluidas": qs.filter(status='Concluida').count(),
            "canceladas": qs.filter(status='Cancelada').count(),
        }

        return Response(resumo)
    
    @action(detail=False, methods=['get'])
    def eventos_veterinario(self, request):   
        from django.utils.timezone import localtime, make_aware, get_current_timezone
        from datetime import datetime, time, timedelta # time é mais limpo que datetime.min.time() 

        veterinario_id = request.query_params.get("veterinario")
        if not veterinario_id:
            return Response([], status=200)

        # Consultas agendadas já no formato necessário
        consultas = (
            Consulta.objects.filter(veterinario_id=veterinario_id)
            .select_related("animal", "veterinario")
        )

        consultas_dict = {
              f"{localtime(c.data).strftime('%Y-%m-%d')}-{localtime(c.data).hour}": c.id for c in consultas
          }
        # 2025-09-12-09
        print(consultas_dict)

        eventos = [
            {
                "id": c.id,
                "title": f"{c.animal.nome} - {c.veterinario.nome}",
                "start": localtime(c.data).strftime("%Y-%m-%dT%H:%M:%S"), # 2: Converta para o fuso local
                "color": "#dc3545",  # vermelho
            }
            for c in consultas
        ]

        hoje = localtime().date() # Use localtime() para pegar a data atual no fuso correto
        horarios = [8, 9, 10, 11, 13, 14, 15, 16]

        for i in range(7): 
            data = hoje + timedelta(days=i)
            if data.weekday() >= 5:  # Pula sábado e domingo
                continue 

            for hora in horarios:
                key = f"{data.strftime('%Y-%m-%d')}-{hora}" 
                print(key)
                if key not in consultas_dict:
                    slot_inicio = make_aware(datetime.combine(data, time(hour=hora)), get_current_timezone()) # timezone são paulo, portugal
                    eventos.append(
                        {
                            "id": f"disp-{data}-{hora}",
                            "title": "Disponível",
                            "start": slot_inicio.strftime("%Y-%m-%dT%H:%M:%S"), # Formate o slot fuso horário
                            "color": "#28a745",  # verde
                        }
                    )  
        return Response(eventos)