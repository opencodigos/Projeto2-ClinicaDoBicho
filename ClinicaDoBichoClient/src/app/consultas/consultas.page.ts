import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonBadge,
  IonIcon,
  AlertController,
  IonItemOptions,
  IonItemOption,
  IonList,
  IonItemSliding } from '@ionic/angular/standalone';

import { ApiService, Consulta } from '../services/api';
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
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonSegment,
    IonSegmentButton,
    IonItemSliding,
    IonList,
    IonItemOption,
    IonItemOptions,
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
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {
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
      console.log(this.filtroStatus)
      this.consultasFiltradas = this.consultas.filter(consulta => {
        const statusNormalizado = (consulta.status || 'agendada').toLowerCase();
        return statusNormalizado === this.filtroStatus;
      });
    }
  }

  async listConsultas() {

    // Cria e exibe o loading
    const loading = await this.loadingCtrl.create({
      message: 'Carregando...',
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



// Cancelar uma consulta
  async cancelarConsulta(consulta: Consulta) {

    console.log("Cancelar consulta com ID:", consulta.id);

    let data = {
      id: consulta.id,
      data: consulta.data,
      motivo: consulta.motivo,
      observacoes: consulta.observacoes,
      status: 'Cancelada'
    };

    // Criar alert
    const alert = await this.alertCtrl.create({
      header: 'Confirmar cancelamento',
      message: `Tem certeza que deseja cancelar a consulta ${consulta.animal.nome}?`,
      buttons: [
        {
          text: 'Sair',
          role: 'cancel'
        },
        {
          text: 'Confirmar',
          role: 'destructive',
          handler: () => {
            console.log('Consulta cancelada:', consulta);

            this.api.editarConsulta(data as Consulta).subscribe({
              next: () => {
                console.log("Consulta cancelada com sucesso!");

                // Atualiza localmente a consulta cancelada para feedback imediato
                const index = this.consultas.findIndex(c => c.id === consulta.id);
                console.log("Index da consulta cancelada:", index);
                if (index !== -1) {
                  this.consultas[index].status = 'Cancelada';
                  this.filtrarConsultas(); // Atualiza a lista filtrada
                }

                // Recarrega todas as consultas do servidor
                this.listConsultas();
              },
              error: (error) => {
                console.error('Erro ao cancelar consulta:', error);
              }
            });

          }
        }
      ]
    });

    await alert.present();
  }





}
