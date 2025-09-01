import { Component } from '@angular/core';
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
  IonDatetime,
  IonSelectOption,
  IonSelect} from '@ionic/angular/standalone';

import { ApiService, Consulta, Animal, Veterinario } from '../services/api';
import { Router } from '@angular/router';

import { addIcons } from 'ionicons';
import { checkmarkCircleOutline } from 'ionicons/icons';

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
    IonDatetime,
    IonSelect,
    IonSelectOption
  ]
})
export class AgendarConsultaPage {

  public consulta: Consulta = {
    animal: {} as Animal,
    veterinario: {} as Veterinario,
    data: new Date().toISOString(),
    motivo: '',
    observacoes: ''
  };

  animais: Animal[] = [];
  veterinarios: Veterinario[] = [];

  // Limita de hoje até 30 dias à frente exceto hora
  minDate = new Date().toISOString();
  maxDate = new Date(new Date().setDate(new Date().getDate() + 30)).toISOString();

  constructor(private api: ApiService, private router: Router) {
    addIcons({ checkmarkCircleOutline });
  }

  ngOnInit() {
    this.listAnimais();
    this.listVeterinarios();
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
        this.router.navigate(['/consultas']);
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

