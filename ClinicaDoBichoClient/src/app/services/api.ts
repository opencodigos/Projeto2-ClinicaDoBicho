import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Cliente {
  id?: number;
  nome: string;
  cpf: string;
}

export interface Animal {
  id?: number;
  nome: string;
  tipo_especie: string;
  especie: string;
  raca: string;
  idade: number;
  peso: number;
  dono: Cliente
}

export interface Veterinario {
  id?: number;
  nome: string;
  crmv: string;
  especialidade: string;
}

export interface Consulta {
  id?: number;
  animal: Animal;
  veterinario: Veterinario;
  data: string;
  motivo: string;
  observacoes?: string;
  status: string;
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
  listConsultas(): Observable<Consulta[]> {
    console.log('ApiService: Método getConsultas() chamado. Fazendo requisição GET...');

    return this.http.get<Consulta[]>(`${this.baseUrl}/consultas/`);
  }

  // Resumo Consultas
  resumoConsultas(): Observable<Consulta[]> {
    console.log('ApiService: Método getConsultas() chamado. Fazendo requisição GET...');

    return this.http.get<Consulta[]>(`${this.baseUrl}/consultas/resumo_consultas/`);
  }

  // Evento por veterinario
  getEventosVeterinario(veterinarioId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/consultas/eventos_veterinario/?veterinario=${veterinarioId}`);
  }

  // criar consulta
  agendarConsulta(consulta: Consulta): Observable<Consulta> {
    return this.http.post<Consulta>(`${this.baseUrl}/consultas/`, consulta);
  }

  listAnimais(): Observable<Animal[]> {
    return this.http.get<Animal[]>(`${this.baseUrl}/animais/`);
  }

  // Adicionar um novo Animal
  addAnimal(animal: Animal): Observable<Animal> {
    return this.http.post<Animal>(`${this.baseUrl}/animais/`, animal);
  }

  // Editar um Animal
  editarAnimal(animal: Animal): Observable<Animal> {
    return this.http.put<Animal>(`${this.baseUrl}/animais/${animal.id}/`, animal);
  }

  // Deletar um Animal 
  deleteAnimal(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/animais/${id}/`);
  }

  listVeterinarios(): Observable<Veterinario[]> {
    return this.http.get<Veterinario[]>(`${this.baseUrl}/veterinarios/`);
  }
}
