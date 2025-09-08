import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, IonRow, IonGrid, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/angular/standalone';
import { AuthService } from '../services/auth-service';
import { ApiService } from '../services/api';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonCardContent,
    IonCardTitle,
    IonCardHeader,
    IonCard,
    IonCol,
    IonGrid,
    IonRow,
    IonButton
    ]
})
export class InicioPage implements OnInit {

  username: string | null = null;

  resumo: any = {
    agendadas: 0,
    concluidas: 0,
    canceladas: 0,
    todas: 0
  };


  constructor(private authService: AuthService, private api: ApiService) {}

  async ngOnInit() {
    const profile = await this.authService.getUserProfile();
    if (profile) {
      this.username = profile.username;
    }

    this.getResumoConsultas();
  }

 async logout() {
    await this.authService.logout()
  }


  getResumoConsultas() {

    this.api.resumoConsultas().subscribe({
      next: (data) => {
        this.resumo = data;

        console.log(data);
      },
      error: (err) => {
        console.error(err);
      }
    });


 }

}
