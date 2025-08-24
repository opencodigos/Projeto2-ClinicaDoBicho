from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.contrib import messages
from .models import Animal, Consulta, Cliente
from .forms import ConsultaForm, AnimalForm, ClienteForm

def lista_animais(request):
    animais = Animal.objects.all() # Obtém todos os animais
    print(animais) 
    return render(request, 'lista_animais.html', {'animais': animais})


def add_animal(request):
    if request.method == 'POST':
        form = AnimalForm(request.POST)
        if form.is_valid():
            animal = form.save(commit=False) 
            cpf = request.POST.get("cpf")
            print(cpf)
            animal.dono = Cliente.objects.get(cpf=cpf) 
            animal.save()
            return JsonResponse({'id': animal.id, 'nome': animal.nome})
        else:
            return JsonResponse({'errors': form.errors}, status=400)
    else:
        form = AnimalForm()
    return render(request, 'add_animal_modal.html', {'form': form})

def add_cliente(request):
    if request.method == 'POST':
        form = ClienteForm(request.POST)
        if form.is_valid():
            cliente = form.save() 
            return JsonResponse(
                {'redirect_url': f'/agendar_consulta/?cpf={cliente.cpf}'}) 
        else:
            return JsonResponse({'errors': form.errors}, status=400)
    else:
        form = ClienteForm()
    return render(request, 'add_cliente_modal.html', {'form': form})


# Agendar Consulta
def agendar_consulta(request):
    cliente = None
    animais = None

    cpf = request.GET.get("cpf")
    if cpf:
        try:
            cliente = Cliente.objects.get(cpf=cpf)
            animais = cliente.animais.all()
        except Cliente.DoesNotExist:
            pass

    if request.method == 'POST':
        # botão buscar cliente
        if "buscar" in request.POST:
            cpf = request.POST.get("cpf")
            print(cpf)
            try:
                cliente = Cliente.objects.get(cpf=cpf)
                animais = cliente.animais.all()
                print(cliente, animais)
                form = ConsultaForm() 
            except Cliente.DoesNotExist:
                messages.error(request, "Cliente não encontrado.")
                form = ConsultaForm() 

        # botão salvar consulta
        elif "salvar" in request.POST:
            form = ConsultaForm(request.POST)
            if form.is_valid():
                form.save()
                messages.success(request, 'Consulta agendada com sucesso!')
                return redirect('lista_consultas')
            else:
                messages.error(request, 'Erro ao agendar consulta.')
    else:
        form = ConsultaForm()  
    form_pet = AnimalForm()
    form_cliente = ClienteForm()
    return render(request, 'agendar_consulta.html', {
        'form': form, 
        'cliente': cliente,
        'animais': animais, 
        'form_pet': form_pet,
        'form_cliente': form_cliente
    }) 

def lista_consultas(request):
    consultas = Consulta.objects.all().order_by('-data')
    return render(request, 'lista_consultas.html', {'consultas': consultas})
