from django.db import models
from django.core.exceptions import ValidationError 
from django.contrib.auth.models import User

# Tabela de clientes
class Cliente(models.Model):
    usuario = models.OneToOneField(User, 
                                   on_delete=models.CASCADE, 
                                   related_name='cliente', null=True)
    nome = models.CharField(max_length=100)
    cpf = models.CharField(max_length=11, blank=True, null=True)
    telefone = models.CharField(max_length=15)
    email = models.EmailField()
    endereco = models.TextField()

    def __str__(self):
        return self.nome

# Tabela de Animais
class Animal(models.Model):
    ESPECIES = [
        ('C', 'Cachorro'),
        ('G', 'Gato'),
        ('O', 'Outros'),
    ]
    nome = models.CharField(max_length=100)
    especie = models.CharField(max_length=1, choices=ESPECIES)
    raca = models.CharField(max_length=100)
    idade = models.PositiveIntegerField(null=True, blank=True)
    peso = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    dono = models.ForeignKey(Cliente, on_delete=models.CASCADE, related_name='animais')

    def __str__(self):
        return f"{self.nome} ({self.especie})" 

    @property
    def get_tipo_especie(self):
        return dict(self.ESPECIES).get(self.especie, 'Desconhecido')

# Cadastro de Doutores
class MedicoVeterinario(models.Model):
    # nome da especie
    nome = models.CharField(max_length=100)
    crmv = models.CharField(max_length=20)
    especialidade = models.CharField(max_length=100)
    contato = models.CharField(max_length=15)

    def __str__(self):
        return self.nome

# Agenda consulta
class Consulta(models.Model):
    animal = models.ForeignKey(Animal, on_delete=models.CASCADE)
    veterinario = models.ForeignKey(MedicoVeterinario, on_delete=models.SET_NULL, null=True)
    data = models.DateTimeField()
    motivo = models.TextField()
    observacoes = models.TextField(blank=True)

    def clean(self):
        if Consulta.objects.filter(
            data=self.data, veterinario=self.veterinario).exists():
            raise ValidationError('Já existe uma consulta agendada \
                                  para este horário com este veterinário.')

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

    def __str__(self):
        veterinario = self.veterinario.nome if self.veterinario else 'desconhecido'
        return f"Consulta de {self.animal.nome} com {veterinario} em {self.data}"