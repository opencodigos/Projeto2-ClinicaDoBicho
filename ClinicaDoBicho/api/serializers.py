from rest_framework import serializers
from core.models import Cliente, Animal, MedicoVeterinario, Consulta

class ClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cliente
        fields = '__all__'

class ClienteSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cliente
        fields = ['id', 'nome', 'cpf']

class AnimalSerializer(serializers.ModelSerializer):
    dono = ClienteSimpleSerializer(read_only=True)
    tipo_especie = serializers.CharField(source='get_tipo_especie', read_only=True)

    class Meta:
        model = Animal
        fields = ('id', 'nome','especie', 'tipo_especie', 'raca', 'idade', 'peso', 'dono')

class MedicoVeterinarioSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = MedicoVeterinario
        fields = ['id', 'nome', 'especialidade']

class MedicoVeterinarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = MedicoVeterinario
        fields = '__all__'

class ConsultaSerializer(serializers.ModelSerializer):
    animal = AnimalSerializer(read_only=True)
    veterinario = MedicoVeterinarioSimpleSerializer(read_only=True)

    class Meta:
        model = Consulta
        fields = '__all__'
