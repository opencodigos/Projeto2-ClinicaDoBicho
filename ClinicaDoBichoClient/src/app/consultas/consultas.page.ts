import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCardContent,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonBadge,
  IonIcon
} from '@ionic/angular/standalone';import { ApiService, Consulta } from '../services/api';
import { LoadingController } from '@ionic/angular';
import { calendarOutline, medkitOutline, pawOutline, personOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';

@Component({
  selector: 'app-consultas',
  templateUrl: './consultas.page.html',
  styleUrls: ['./consultas.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonCardContent,
    IonCardTitle,
    IonCardSubtitle,
    IonCardHeader,
    IonCard,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonBadge,
    IonIcon
  ]})
export class ConsultasPage implements OnInit {

  consultas: Consulta[] = []; // Lista de consultas
  consultasFiltradas: Consulta[] = []; // Lista de consultas Filtradas
  filtroStatus: string = 'todas'; // Inicia com todos

  constructor(
    private api: ApiService,
    private loadingCtrl: LoadingController) {
    addIcons({
      calendarOutline,
      personOutline,
      pawOutline,
      medkitOutline
    });
  }

  ngOnInit() {
    this.listConsultas(); // Carrega lista de consultas
  }


  // Método para filtrar consultas por status
  filtrarConsultas() {
    if (this.filtroStatus === 'todas') {
      this.consultasFiltradas = [...this.consultas];
    } else {
      this.consultasFiltradas = this.consultas.filter(consulta =>
        (consulta.status || 'agendada').toLowerCase() === this.filtroStatus
      );
    }
  }

   // Método para obter o texto do status
  // nao temos esse parametro ainda vindo do DB mas podemos deixar aqui pra usar
  getStatusText(status: string | undefined): string {
    switch ((status || 'agendada').toLowerCase()) {
      case 'agendada': return 'Agendada';
      case 'concluida': return 'Concluída';
      case 'cancelada': return 'Cancelada';
      default: return 'Pendente';
    }
  }



  async listConsultas() {

    // Cria e exibe o loading
    const loading = await this.loadingCtrl.create({
      message: 'Entrando...',
      spinner: 'crescent',
      backdropDismiss: false
    });

    await loading.present(); // mostra

    this.api.listConsultas().subscribe({
      next: async (data) => {
        console.log("Lista de Consultas:", data);
        this.consultas = data;

        this.filtrarConsultas();

        await loading.dismiss()
      },
      error: async (error) => {
        console.error('Erro ao buscar consultas:', error);

        await loading.dismiss()
      }
    });

  }
}
