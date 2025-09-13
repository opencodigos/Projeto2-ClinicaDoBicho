import random
from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.contrib import messages
from .models import Animal, Consulta, Cliente
from .forms import ConsultaForm, AnimalForm, ClienteForm
from django.contrib.auth import login, logout
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.decorators import login_required


# Login
def login_view(request):
    if request.method == "POST":
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            user = form.get_user()
            print(user)
            login(request, user)
            return redirect('home')  # troque para sua URL de destino
    else:
        form = AuthenticationForm()
    return render(request, 'login.html', {'form': form})


@login_required(login_url='login')
def logout_view(request):
    logout(request)
    return redirect('login')


@login_required(login_url='login')
def lista_animais(request):
    animais = Animal.objects.all() # Obtém todos os animais
    # print(animais) 
    return render(request, 'lista_animais.html', {'animais': animais})


@login_required(login_url='login')
def add_animal(request):
    if request.method == 'POST':
        form = AnimalForm(request.POST)
        if form.is_valid():
            animal = form.save(commit=False) 
            cpf = request.POST.get("cpf")
            # print(cpf)
            animal.dono = Cliente.objects.get(cpf=cpf) 
            animal.save()
            return JsonResponse({'id': animal.id, 'nome': animal.nome})
        else:
            return JsonResponse({'errors': form.errors}, status=400)
    else:
        form = AnimalForm()
    return render(request, 'add_animal_modal.html', {'form': form})


@login_required(login_url='login')
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

 
@login_required(login_url='login')
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
            # print(cpf)
            try:
                cliente = Cliente.objects.get(cpf=cpf)
                animais = cliente.animais.all()
                # print(cliente, animais)
                form = ConsultaForm() 
            except Cliente.DoesNotExist:
                messages.error(request, "Cliente não encontrado.")
                form = ConsultaForm() 

        # botão salvar consulta
        elif "salvar" in request.POST:
            form = ConsultaForm(request.POST)
            # print(request.POST)
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


@login_required(login_url='login')
def lista_consultas(request):
    consultas = Consulta.objects.all().order_by('-data')
    return render(request, 'lista_consultas.html', {'consultas': consultas})


@login_required(login_url='login')
def consulta_eventos(request):
    eventos = []
    for c in Consulta.objects.all():
        eventos.append({
            "id": c.id,
            "title": f"{c.animal.nome} - {c.veterinario.nome}",
            "start": c.data.strftime("%Y-%m-%dT%H:%M:%S"),
            "color": "#" + "".join([random.choice("0123456789ABCDEF") for _ in range(6)])
        })
    # print(eventos)
    return JsonResponse(eventos, safe=False)


@login_required(login_url="login")
def consulta_eventos_veterinario(request):
    from django.utils.timezone import localtime, make_aware, get_current_timezone
    from datetime import datetime, time, timedelta # time é mais limpo que datetime.min.time() 

    veterinario_id = request.GET.get("veterinario")
    if not veterinario_id:
        return JsonResponse([], status=200)

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
    return JsonResponse(eventos, safe=False)