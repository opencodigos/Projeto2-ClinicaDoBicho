import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar, IonItem, IonLabel, IonButton, IonInput } from '@ionic/angular/standalone';

import { ApiService } from '../services/api';
import { Router } from '@angular/router';
import { StorageService } from '../services/storage';

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
  ]
})
export class LoginPage {

  username = '';
  password = '';

  constructor(
    private api: ApiService,
    private router: Router,
    private storage: StorageService
  ) {}

  login() {
    this.api.login(this.username, this.password).subscribe({
      next: (res) => {
        console.log("Resposta do login:", res);
        if (res.access) {
          this.storage.set('token', res.access).then(() => {
            this.router.navigate(['/consultas']);
          });
        }
      },
      error: (err) => {
        console.error("Erro no login:", err);
        alert('Usuário ou senha inválidos!');
      }
    });
  }

}
