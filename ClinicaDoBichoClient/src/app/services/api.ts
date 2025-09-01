import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Animal {
  id?: number;
  nome: string;
  especie: string;
  raca: string;
  idade: number;
}

export interface Consulta {
  id?: number;
  animal: Animal;
  veterinario: number;
  data: string;
  motivo: string;
  observacoes?: string;
}

@Injectable({
  providedIn: 'root' // já disponível em todo app
})
export class ApiService {

  private baseUrl = 'http://127.0.0.1:8000/api'; // backend Django

  constructor(private http: HttpClient) {}

  // login retorna login
  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/login/`, { username, password });
  }

  // pegar consultas
  getConsultas(): Observable<Consulta[]> {
    return this.http.get<Consulta[]>(`${this.baseUrl}/consultas/`);
  }

  // criar consulta
  agendarConsulta(consulta: Consulta): Observable<Consulta> {
    return this.http.post<Consulta>(`${this.baseUrl}/consultas/`, consulta);
  }
}
