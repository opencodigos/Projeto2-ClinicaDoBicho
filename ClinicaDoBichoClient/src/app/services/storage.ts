import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _storage: Storage | null = null;

  // Injetamos o Storage "cru" do Ionic
  constructor(private storage: Storage) {
    // Iniciamos a inicialização no construtor do serviço
    this.init();
  }

  // O método de inicialização que lida com a parte assíncrona
  async init() {
    // Se o storage já foi inicializado, não faz nada.
    if (this._storage) {
      return;
    }
    // Chama o create() e, quando terminar, atribui a instância pronta à nossa variável.
    const storage = await this.storage.create();
    this._storage = storage;
  }

  // Criamos nossos próprios métodos 'set' e 'get' que garantem que o storage está pronto.
  public async set(key: string, value: any) {
    // Espera a inicialização terminar, caso ainda não tenha terminado.
    await this.init();
    return this._storage?.set(key, value);
  }

  public async get(key: string) {
    await this.init();
    return this._storage?.get(key);
  }

  public async remove(key: string) {
    await this.init();
    return this._storage?.remove(key);
  }

  
}
