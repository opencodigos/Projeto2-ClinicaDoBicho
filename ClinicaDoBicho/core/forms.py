from django import forms 
from .models import Consulta, Cliente, Animal
from django.contrib.auth.models import User 

# Formulário para o modelo Animal
class AnimalForm(forms.ModelForm):
    class Meta:
        model = Animal
        fields = ['nome', 'especie', 'raca', 'idade', 'peso']
        widgets = {
            'nome': forms.TextInput(attrs={'class': 'form-control'}),
            'idade': forms.NumberInput(attrs={'class': 'form-control'}),
            'especie': forms.Select(attrs={'class': 'form-select'}),
            'raca': forms.TextInput(attrs={'class': 'form-control'}),
            'peso': forms.NumberInput(attrs={'class': 'form-control'}),
        }  

# Formulário para o modelo Clientes
class ClienteForm(forms.ModelForm):
    class Meta:
        model = Cliente
        fields = ['nome', 'cpf', 'telefone', 'email', 'endereco']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        for field in self.fields.values():
            field.widget.attrs.update({'class': 'form-control'}) 

    def save(self, commit=True):
        """
        Cria usuários para cliente que não possuem um usuário associado 
        """
        cliente = super().save(commit=False)
        print("[FORMS linha 32]",  cliente)
        if not cliente.usuario: # usuario == null, vazio
            if cliente.email:
                username = cliente.email.split('@')[0]
            else:
                username = cliente.nome

            senha = cliente.cpf
            user = User.objects.create_user(
                username=username,
                email=cliente.email,
                password=senha,
                first_name=cliente.nome
            )
            cliente.usuario = user

        if commit:
            cliente.save()
        return cliente 

# Formulário para o modelo Consulta
class ConsultaForm(forms.ModelForm):
    class Meta:
        model = Consulta
        fields = ['animal', 'veterinario', 'data', 'motivo', 'observacoes']
        widgets = { 
            'data': forms.DateTimeInput(
                attrs={'type': 'datetime-local', 'class': 'form-control'},
                format='%Y-%m-%dT%H:%M'
            ),
            'motivo': forms.TextInput(attrs={'class': 'form-control'}),
            'observacoes': forms.Textarea(attrs={'rows': 3, 'class': 'form-control'}),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs) 

        for field in self.fields.values():
            field.widget.attrs.update({'class': 'form-control'})
            
        

    def clean(self): 
        cleaned_data = super().clean()
        data = cleaned_data.get('data')
        veterinario = cleaned_data.get('veterinario')

        # Garante que ambos os campos existem antes de tentar a consulta
        if data and veterinario:
            # Exclui a própria instância se estivermos editando uma consulta existente
            # Isso evita que o formulário dê erro ao salvar uma edição sem alterar o horário.
            qs = Consulta.objects.filter(data=data, veterinario=veterinario)
            if self.instance.pk:
                qs = qs.exclude(pk=self.instance.pk)
            
            if qs.exists():
                raise forms.ValidationError(
                    'Já existe uma consulta agendada neste horário para este veterinário.'
                )
        
        return cleaned_data
     
