import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar, IonItem, IonLabel, IonButton, IonInput, IonIcon } from '@ionic/angular/standalone';

import { ApiService } from '../services/api';
import { Router } from '@angular/router';
import { StorageService } from '../services/storage';
import { AuthService } from '../services/auth-service';

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
    IonHeader,
    IonTitle,
    IonToolbar,
    IonIcon,
  ]
})
export class LoginPage {

  username = '';
  password = '';

  constructor(
    private apiService: ApiService,     // O serviço que fala com a API
    private authService: AuthService,   // O serviço que gerencia os tokens
    private router: Router
  ) {}

 login() {
    console.log('--- PROCESSO DE LOGIN INICIADO ---');
    this.apiService.login(this.username, this.password).subscribe({
      next: async (resposta) => {
        console.log('[LoginPage] Resposta da API simulada recebida:', resposta);

        if (resposta && resposta.access) {

          await this.authService.setTokens(resposta.access, resposta.refresh);

          console.log('[LoginPage] Navegando para /consultas...');
          this.router.navigate(['/consultas']); // Rota consultas
        }
      },
      error: (err) => {
        console.error('Algo deu errado na simulação', err);
      },
    });
  }

}
