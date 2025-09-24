import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  IonInput,
  IonItem,
  IonLabel,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonSelect,
  IonSelectOption,
  ModalController
} from '@ionic/angular/standalone';

@Component({
    selector: 'app-pet-edit-modal',
    standalone: true,
    imports: [
      CommonModule,
      FormsModule,
      IonInput,
      IonItem,
      IonLabel,
      IonButton,
      IonButtons,
      IonContent,
      IonHeader,
      IonTitle,
      IonToolbar,
      IonSelect,
      IonSelectOption,
    ],
    template: `
    <ion-header>
      <ion-toolbar color="custom-toolbar">
        <ion-title>{{ pet.id ? 'Editar Pet' : 'Adicionar Pet' }}</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="fechar()">Fechar</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-item>
        <ion-label position="stacked">Nome</ion-label>
        <ion-input [(ngModel)]="pet.nome"></ion-input>
      </ion-item>

      <ion-item>
        <ion-label position="stacked">Raça</ion-label>
        <ion-input [(ngModel)]="pet.raca"></ion-input>
      </ion-item>

      <ion-item>
        <ion-label position="stacked">Tipo de Especie</ion-label>
        <ion-select [(ngModel)]="pet.especie">
          <ion-select-option value="G">Gato</ion-select-option>
          <ion-select-option value="C">Cachorro</ion-select-option>
          <ion-select-option value="O">Outros</ion-select-option>
        </ion-select>
      </ion-item>

      <ion-item>
        <ion-label position="stacked">Idade</ion-label>
        <ion-input type="number" [(ngModel)]="pet.idade"></ion-input>
      </ion-item>

      <ion-item>
        <ion-label position="stacked">Peso</ion-label>
        <ion-input type="number" [(ngModel)]="pet.peso"></ion-input>
      </ion-item>

      <ion-button expand="block" class="custom-button" (click)="salvar()">Salvar</ion-button>
    </ion-content>
    `
  })
  export class PetModalComponent {
    @Input() pet: any;

    constructor(private modalCtrl: ModalController) {}

    fechar() {
      this.modalCtrl.dismiss();
    }

    salvar() {
      this.modalCtrl.dismiss(this.pet, 'salvar');
    }
  }
