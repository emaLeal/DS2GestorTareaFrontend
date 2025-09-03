
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
//servicio de busqueda global para filtrar tareas en HomeBoard y mas busquedas futuras
export class SearchService {
  private searchTerm = new BehaviorSubject<string>(''); // valor inicial vacío 
  search$ = this.searchTerm.asObservable(); // observable para escuchar

  setSearchTerm(term: string) {
    this.searchTerm.next(term); // actualiza el término de búsqueda
  }
}
