import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
   IonContent,
   IonHeader,
   IonTitle,
   IonToolbar,
   IonList,
   IonItem,
   IonLabel,
   IonButtons,
   IonButton,
   IonIcon,
   IonAvatar,
   IonThumbnail,
   ModalController,
   AlertController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addCircleOutline, createOutline, trashOutline } from 'ionicons/icons';

import { ApiService, Animal } from '../services/api';
import { PetModalComponent } from './pets.modal';

@Component({
  selector: 'app-pets',
  templateUrl: './pets.page.html',
  styleUrls: ['./pets.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonList,
    IonItem,
    IonLabel, 
    IonThumbnail,
    IonButtons,
    IonButton,
    IonIcon
  ]
})
export class PetsPage implements OnInit {

  animais: Animal[] = [];

  animal: Animal | null = null;

  constructor(
      private apiService: ApiService,
      private modalCtrl: ModalController,
      private alertCtrl: AlertController) {
    addIcons({
      addCircleOutline,
      createOutline,
      trashOutline,
    });
   }

  ngOnInit() {
    this.getPets();
  }

  getPets() {

    this.apiService.listAnimais().subscribe({
      next: (animais: Animal[]) => {
        console.log('Animais:', animais);
        this.animais = animais;
      },
      error: (error) => {
        console.error('Erro ao buscar animais:', error);
      }
    });

  }

  async adicionarPet() {

    const modal = await this.modalCtrl.create({
      component: PetModalComponent,
      componentProps: { pet: {} } // objeto vazio para novo pet
    });

    await modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'salvar') {
      console.log('Animal adicionado:', data);

      this.apiService.addAnimal(data).subscribe({
        next: (animal: Animal) => {
          console.log('Animal adicionado:', animal);

          this.getPets(); // atualiza a lista de animais
        },
        error: (error) => {
          console.error('Erro ao adicionar animal:', error);
        }
      });

    }
  }


  async editarPet(pet: any) {

    console.log('Editar pet:', pet);

    const modal = await this.modalCtrl.create({
      component: PetModalComponent,
      componentProps: { pet }
    });
    await modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'salvar') {

      this.apiService.editarAnimal(data).subscribe({
        next: (animal: Animal) => {
          console.log('Animal editado:', animal);
          this.animal = animal;
          this.getPets(); // atualiza a lista de animais
        },
        error: (error) => {
          console.error('Erro ao editar animal:', error);
        }
      });

    }
  }



  async excluirPet(pet: any) {
    console.log('Excluir pet:', pet);

    // Confirmação de exclusão
    const alert = await this.alertCtrl.create({
      header: 'Confirmar exclusão',
      message: `Tem certeza que deseja excluir o pet ${pet.nome}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Excluir',
          role: 'destructive',
          handler: () => {
            console.log('Animal excluído:', pet);

            this.apiService.deleteAnimal(pet.id).subscribe(() => {
              this.getPets(); // atualiza a lista de animais
            });

          }
        }
      ]
    });

    await alert.present();
  }




}
