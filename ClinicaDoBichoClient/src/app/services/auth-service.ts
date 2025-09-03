import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StorageService } from './storage';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private apiUrl = 'http://127.0.0.1:8000/api';
  private accessTokenKey = 'access_token';
  private refreshTokenKey = 'refresh_token';

  constructor(private http: HttpClient, private storage: StorageService) {}

  // Pega token
  async getAccessToken() {
    return await this.storage.get(this.accessTokenKey);
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

  // Logout deixa ele aqui depois vamos usar.
  async logout() {
    await this.storage.remove(this.accessTokenKey);
    await this.storage.remove(this.refreshTokenKey);
  }
}
