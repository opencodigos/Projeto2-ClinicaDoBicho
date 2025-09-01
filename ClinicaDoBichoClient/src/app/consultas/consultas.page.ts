import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent } from '@ionic/angular/standalone';
import { ApiService, Consulta } from '../services/api';

@Component({
  selector: 'app-consultas',
  templateUrl: './consultas.page.html',
  styleUrls: ['./consultas.page.scss'],
  standalone: true,
  imports: [IonCardContent, IonCardTitle, IonCardSubtitle, IonCardHeader, IonCard, IonList, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class ConsultasPage implements OnInit {

  consultas: Consulta[] = [];

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.listConsultas(); // Carrega lista de consultas
  }

  listConsultas() {
    this.api.listConsultas().subscribe({
      next: (data) => {
        console.log("Lista de Consultas:", data);
        this.consultas = data;
      },
      error: (error) => {
        console.error('Erro ao buscar consultas:', error);
      }
    });

  }
}
