import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonLabel,
  IonItem,
  IonInput,
  IonButton,
  IonIcon,
  IonTextarea,
  IonAvatar,
  ModalController,
  LoadingController,
  AlertController
} from '@ionic/angular/standalone';

import { ApiService, Consulta, Animal, Veterinario } from '../services/api';
import { Router } from '@angular/router';

import { addIcons } from 'ionicons';
import { checkmarkCircleOutline } from 'ionicons/icons';
import { ListaAnimaisModal } from './lista-animais-modal';
import { ListaVeterinariosModal } from './lista-veterinario-modal';
import { CalendarComponent } from '../components/calendar/calendar.component';

@Component({
  selector: 'app-agendar-consulta',
  templateUrl: './agendar-consulta.page.html',
  styleUrls: ['./agendar-consulta.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonIcon,
    IonButton,
    IonInput,
    IonItem,
    IonLabel,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonTextarea,
    IonAvatar,
    CalendarComponent
  ]
})
export class AgendarConsultaPage {

  public consulta: Consulta = {
    animal: {} as Animal,
    veterinario: {} as Veterinario,
    data: new Date().toISOString(),
    motivo: '',
    observacoes: '',
    status: 'Agendada'
  };

  animais: Animal[] = [];
  veterinarios: Veterinario[] = [];

  // Limita de hoje até 30 dias à frente exceto hora
  minDate = new Date().toISOString();
  maxDate = new Date(new Date().setDate(new Date().getDate() + 30)).toISOString();

  // Modal
  animalSelecionado: any = null;
  veterinarioSelecionado: any = null;

  constructor(
    private api: ApiService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController,
    private alertController: AlertController) {
    addIcons({ checkmarkCircleOutline });
  }

  async ngOnInit() {
    const loading = await this.loadingCtrl.create({
      message: 'Carregando...',
      spinner: 'crescent',
      backdropDismiss: false
    });

    await loading.present();

    setTimeout(async () => {
      this.listAnimais();
      this.listVeterinarios();

      await loading.dismiss();
    }, 2000);
  }


  // Modal Lista de Animais
  async abrirModalAnimais() {
    // tira foco de qualquer botão/input ativo da tela
    (document.activeElement as HTMLElement)?.blur();

    const modal = await this.modalCtrl.create({
      component: ListaAnimaisModal,
      componentProps: {
        animais: this.animais
      }
    });

    modal.onDidDismiss().then((result) => {
      if (result.data) {
        console.log('Animal selecionado:', result.data);
        this.animalSelecionado = result.data;
        this.consulta.animal = result.data.id; // Passa id do animal p/ DB
      }
    });

    return await modal.present();
  }

  async abrirModalVeterinarios() {
    // tira foco de qualquer botão/input ativo da tela
    (document.activeElement as HTMLElement)?.blur();

    const modal = await this.modalCtrl.create({
      component: ListaVeterinariosModal,
      componentProps: {
        veterinarios: this.veterinarios
      }
    });
    await modal.present();

    modal.onDidDismiss().then((result) => {
      if (result.data) {
        console.log('Veterinario selecionado:', result.data);
        let res = result.data
        this.veterinarioSelecionado = res;
        this.consulta.veterinario = res.id // Passa id do veterinario p/ DB
      }
    });

  }

  /**
   * FullCalendar
   * @returns
   */

  // data
  meusEventos = [
    {
      id: 1,
      title: "Disponível",
      start: '2025-09-15T14:00:00',
      color: "#28a745",
    },
    {
      id: 2,
      title: "Disponível",
      start: '2025-09-15T15:00:00',
      color: "#28a745",
    },
    {
      id: 3,
      title: "Disponível",
      start: '2025-09-16T10:00:00',
      color: "#28a745",
    },
    {
      id: 4,
      title: "Disponível",
      start: '2025-09-17T09:00:00',
      color: "#28a745",
    }
  ];

  // data
  dataSelecionada: string = '';

  onEventClick(event: any) {
    console.log('Evento clicado ', event.start);

    // Atualiza a data na consulta para ser enviada ao servidor
    this.consulta.data = event.start;

    // Formata a data para exibição amigável
    const data = new Date(event.start);
    const dia = data.getDate().toString().padStart(2, '0');
    const mes = (data.getMonth() + 1).toString().padStart(2, '0');
    const ano = data.getFullYear();
    const hora = data.getHours().toString().padStart(2, '0');
    const minutos = data.getMinutes().toString().padStart(2, '0');
    const periodo = data.getHours() < 12 ? 'da manhã' : data.getHours() < 18 ? 'da tarde' : 'da noite';

    // Cria a string formatada e armazena na propriedade
    this.dataSelecionada = `${dia}/${mes}/${ano} às ${hora}:${minutos} ${periodo}`;

    console.log('Data formatada:', this.dataSelecionada);
  }


  agendar() {

    // no submit a hora
    // validação simples do horário: 08:00-12:00 ou 13:00-17:00
    const date = new Date(this.consulta.data);
    const hour = date.getHours();
    if (!((hour >= 8 && hour < 12) || (hour >= 13 && hour < 17))) {
      alert('Horário deve ser entre 08:00-12:00 ou 13:00-17:00');
      return;
    }

    console.log("Consulta a agendar:", this.consulta);

    this.api.agendarConsulta(this.consulta).subscribe({
      next: (data) => {
        console.log("Status:", data);

        this.router.navigate(['consultas']);

      },
      error: (error) => {
        console.log("Status:", error);
        alert('Erro ao agendar!')
      }
    });

  }


  listAnimais() {
    this.api.listAnimais().subscribe({
      next: (data) => {
        console.log("Lista de Animais:", data);
        this.animais = data;
      },
      error: (error) => {
        console.error('Erro ao buscar animais:', error);
      }
    });
  }

  listVeterinarios() {
    this.api.listVeterinarios().subscribe({
      next: (data) => {
        console.log("Lista de Veterinários:", data);
        this.veterinarios = data;
      },
      error: (error) => {
        console.error('Erro ao buscar veterinários:', error);
      }
    });
  }


}

