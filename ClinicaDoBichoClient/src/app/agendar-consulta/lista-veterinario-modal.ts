import { Veterinario } from './../services/api';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent, IonList, IonItem, IonAvatar, IonLabel, IonText, IonNote } from "@ionic/angular/standalone";

@Component({
  selector: 'app-lista-veterinarios',
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonContent,
    IonList,
    IonItem,
    IonAvatar,
    IonLabel,
    IonText,
    IonNote
],
  standalone: true,
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Selecione o Veterinário</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="fechar()">Fechar</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-list>
        @for (vet of veterinarios; track $index) {
        <ion-item button (click)="selecionar(vet)">
          <ion-avatar slot="start">
            <img src='https://placehold.co/400'>
          </ion-avatar>
          <ion-label>
            <strong>{{ vet.nome }}</strong><br />
          <ion-text>CRMV: {{vet.crmv}}</ion-text><br />
            <ion-note color="medium" class="ion-text-wrap">
              Especialidade: {{vet.especialidade}}
            </ion-note>
          </ion-label>
        </ion-item>
        }
      </ion-list>
    </ion-content>
  `,
  providers: [ModalController] // Adicionar ModalController aos providers
})
export class ListaVeterinariosModal {
  @Input() veterinarios: Veterinario[] = [];

  constructor(private modalCtrl: ModalController) { }

  selecionar(vet: Veterinario) {
    this.modalCtrl.dismiss(vet);
  }

  fechar() {
    this.modalCtrl.dismiss();
  }
}


