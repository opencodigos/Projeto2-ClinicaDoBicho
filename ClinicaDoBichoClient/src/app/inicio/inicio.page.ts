import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, IonRow, IonGrid, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/angular/standalone';
import { AuthService } from '../services/auth-service';

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

  constructor(private authService: AuthService) {}

  async ngOnInit() {
    const profile = await this.authService.getUserProfile();
    if (profile) {
      this.username = profile.username;
    }
  }

 async logout() {
    await this.authService.logout()
  }

}
