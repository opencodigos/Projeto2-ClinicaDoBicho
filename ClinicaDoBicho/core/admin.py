from django.contrib import admin
from .models import (
    Cliente, Animal, MedicoVeterinario, Consulta)

admin.site.register(Cliente)
admin.site.register(Animal)
admin.site.register(MedicoVeterinario)
admin.site.register(Consulta)
