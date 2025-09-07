import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core'; // <--- Importe Input aqui
import { ModalController } from '@ionic/angular';
import { IonContent, IonToolbar, IonHeader, IonTitle, IonButtons, IonButton, IonList, IonItem, IonAvatar, IonLabel,
  IonNote,
  IonText
} from "@ionic/angular/standalone";

@Component({
  selector: 'app-lista-animais',
  imports: [
    CommonModule,
    IonContent,
    IonToolbar,
    IonHeader,
    IonTitle,
    IonButtons,
    IonButton,
    IonList,
    IonItem,
    IonAvatar,
    IonLabel,
    IonNote,
    IonText,
    IonTitle,
    IonToolbar,
],
  standalone: true,
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Selecione o Animal</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="fechar()">Fechar</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-list>
        @for (animal of animais; track $index) {
        <ion-item button (click)="selecionar(animal)">
          <ion-avatar slot="start">
            <img src='https://placehold.co/400'>
          </ion-avatar>
          <ion-label>
            <strong>{{animal.nome}}</strong><br />
            <ion-text>Especie: {{animal.tipo_especie}}</ion-text><br />
            <ion-note color="medium" class="ion-text-wrap">
              Raça: {{animal.raca}}
            </ion-note>
          </ion-label>
        </ion-item>
        }
      </ion-list>
    </ion-content>
  `,
  providers: [ModalController]
})
export class ListaAnimaisModal {
  @Input() animais: any[] = [];

  constructor(private modalCtrl: ModalController) {}

  selecionar(animal: any) {
    this.modalCtrl.dismiss(animal);
  }

  fechar() {
    this.modalCtrl.dismiss();
  }
}
