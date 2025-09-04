import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent } from '@ionic/angular/standalone';
import { ApiService, Consulta } from '../services/api';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-consultas',
  templateUrl: './consultas.page.html',
  styleUrls: ['./consultas.page.scss'],
  standalone: true,
  imports: [IonCardContent, IonCardTitle, IonCardSubtitle, IonCardHeader, IonCard, IonList, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class ConsultasPage implements OnInit {

  consultas: Consulta[] = [];

  constructor(private api: ApiService, private loadingCtrl: LoadingController) {}

  ngOnInit() {
    this.listConsultas(); // Carrega lista de consultas
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

        await loading.dismiss()
      },
      error: async (error) => {
        console.error('Erro ao buscar consultas:', error);
        
        await loading.dismiss()
      }
    });

  }
}
