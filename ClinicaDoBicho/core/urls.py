from django.urls import path
from django.views.generic import TemplateView
from . import views 

urlpatterns = [
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('', TemplateView.as_view(template_name='inicio.html'), name='home'), 
    path('animais/', views.lista_animais, name='lista_animais'),
    path('agendar_consulta/', views.agendar_consulta, name='agendar_consulta'),
    path('consultas/', views.lista_consultas, name='lista_consultas'),
    path('eventos/', views.consulta_eventos, name='consulta_eventos'),
    path('eventos_doctor/', views.consulta_eventos_veterinario, name='eventos_doctor'),
    path('add_animal/', views.add_animal, name='add_animal'),
    path('add_cliente/', views.add_cliente, name='add_cliente'),

    path('clientes/', views.lista_clientes, name='lista_clientes'), 
    path('clientes/<int:pk>/edit/', views.edit_cliente, name='edit_cliente'),
     
    path('animal/<int:pk>/edit/', views.edit_animal, name='edit_animal'),

    path('veterinarios/', views.lista_veterinarios, name='lista_veterinarios'), 
    path('veterinarios/<int:pk>/edit/', views.edit_veterinario, name='edit_veterinario'),
    path('add_veterinario/', views.add_veterinario, name='add_veterinario'),
]
