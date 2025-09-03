"""
URL configuration for ClinicaDoBicho project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include
 
from rest_framework import routers

from api.auth import (
    MyTokenObtainPairView, 
    MyTokenRefreshView
)

from api.views import (
    ClienteViewSet, 
    AnimalViewSet, 
    MedicoVeterinarioViewSet, 
    ConsultaViewSet
)

router = routers.DefaultRouter()
router.register(r'clientes', ClienteViewSet, basename='cliente')
router.register(r'animais', AnimalViewSet, basename='animal')
router.register(r'veterinarios', MedicoVeterinarioViewSet, basename='veterinario')
router.register(r'consultas', ConsultaViewSet, basename='consulta') 

urlpatterns = [
    path('admin/', admin.site.urls), 
    path('api/', include(router.urls)),

    path('api/login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/refresh/', MyTokenRefreshView.as_view(), name='token_refresh'),

    path('', include('core.urls')),
] 
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)