import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StorageService } from './storage';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private apiUrl = 'http://127.0.0.1:8000/api';
  private accessTokenKey = 'access_token';
  private refreshTokenKey = 'refresh_token';

  constructor(private http: HttpClient, private storage: StorageService, private router: Router,) {}

  // Pega token
  async getAccessToken() {
    return await this.storage.get(this.accessTokenKey);
  }

  // Pega token refresh
  async getRefreshToken() {
    return await this.storage.get(this.refreshTokenKey)
  }

  // Salva tokens
  async setTokens(access: string, refresh: string) {
    await this.storage.set(this.accessTokenKey, access);
    await this.storage.set(this.refreshTokenKey, refresh);
  }

  // Renova access token usando refresh token
  async refreshToken() {
    const refresh = await this.storage.get(this.refreshTokenKey);
    return this.http.post<any>(`${this.apiUrl}/auth/refresh/`, { refresh });
  }



  // Logout
  async logout() {
    const refreshToken = await this.getRefreshToken();

    if (refreshToken) {
      // Envia o refresh token para a blacklist no servidor
      this.http.post(`${this.apiUrl}/auth/logout/`, { refresh: refreshToken } ).subscribe({
        next: () => {
          console.log('Token invalidado no servidor com sucesso.');
        },
        error: (err) => {
          console.error('Erro ao invalidar token no servidor:', err);
        },
        complete: async () => {
          // Limpa os tokens do storage local independentemente do resultado
          await this.clearTokens();
          this.router.navigate(['/login']);

        }
      });
    } else {
      // Se não houver token, apenas limpa o storage
      await this.clearTokens();

      // Redireciona
      this.router.navigate(['/login']);
    }
  }

  // Método auxiliar para limpar os tokens
  private async clearTokens(): Promise<void> {
    await this.storage.remove(this.accessTokenKey);
    await this.storage.remove(this.refreshTokenKey);
  }

  async getUserProfile(): Promise<any | null> {
    const token = await this.getAccessToken();
    if (!token) { // True
      return null;
    }
    // Decodifica o token para pegar as informações (payload)
    const decodedToken: any = jwtDecode(token);
    return { username: decodedToken.username }; // Retorna o username
  }


}
