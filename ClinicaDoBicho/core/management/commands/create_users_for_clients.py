from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from core.models import Cliente 

class Command(BaseCommand):
    help = 'Cria usuários para clientes que não possuem um usuário associado'

    def handle(self, *args, **options):
        
        # Obter todos os clientes sem usuário associado
        clientes_sem_usuario = Cliente.objects.filter(usuario__isnull=True)
        
        if not clientes_sem_usuario.exists():
            self.stdout.write(self.style.SUCCESS('Todos os clientes já possuem usuários associados.'))
            return
        
        contador = 0
        
        for cliente in clientes_sem_usuario:
            
            if cliente.email: 
                username = cliente.email.split('@')[0] if cliente.email else None
            else:
                username = cliente.nome 
            
            senha = cliente.nome[:2] + '123123@' # Exemplo Jo123123@
            
            # Criar usuário
            user = User.objects.create_user(
                username=username,
                email=cliente.email,
                password=senha,
                first_name=cliente.nome
            ) 

            # Associar usuário ao cliente
            cliente.usuario = user
            cliente.save()
            
            contador += 1
            self.stdout.write(self.style.SUCCESS(f'Usuário criado para {cliente.nome}'))
        
        self.stdout.write(self.style.SUCCESS(f'Total de {contador} usuários criados com sucesso!'))
