import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonContent,  IonItem, IonLabel, IonButton, IonInput, IonIcon, IonGrid, IonRow, IonCol, LoadingController } from '@ionic/angular/standalone';

import { ApiService } from '../services/api';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { addIcons } from 'ionicons';
import { lockClosedOutline, personOutline } from 'ionicons/icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonInput,
    IonButton,
    IonLabel,
    IonItem,
    IonContent,
    IonIcon,
    IonCol,
    IonRow,
    IonGrid,
  ]
})
export class LoginPage {

  username = '';
  password = '';

  constructor(
    private apiService: ApiService,     // O serviço que fala com a API
    private authService: AuthService,   // O serviço que gerencia os tokens
    private router: Router,
    private loadingCtrl: LoadingController
  ) {
     addIcons({ personOutline, lockClosedOutline });
  }

 async login() {

  // Cria e exibe o loading
  const loading = await this.loadingCtrl.create({
    message: 'Entrando...',
    spinner: 'crescent',
    backdropDismiss: false
  });

  await loading.present(); // mostra

    console.log('--- PROCESSO DE LOGIN INICIADO ---');
    this.apiService.login(this.username, this.password).subscribe({
      next: async (resposta) => {
        console.log('[LoginPage] Resposta da API simulada recebida:', resposta);

        if (resposta && resposta.access) {

          await this.authService.setTokens(resposta.access, resposta.refresh);

          await loading.dismiss(); // esconde o loading

          console.log('[LoginPage] Navegando para /consultas...');
          this.router.navigate(['/tabs/inicio']); // Rota consultas
        }
      },
      error: async (err) => {
        console.error('Algo deu errado na simulação', err);

        await loading.dismiss(); // esconde o loading

        alert('Usuário ou senha inválidos!');
      },
    });
  }

}
