import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private searchTermSubject = new BehaviorSubject<string>('');
  public searchTerm$: Observable<string> = this.searchTermSubject.asObservable();

  /**
   * Actualiza el término de búsqueda
   * @param term Término de búsqueda
   */
  setSearchTerm(term: string): void {
    this.searchTermSubject.next(term);
  }

  /**
   * Obtiene el término de búsqueda actual
   * @returns Término de búsqueda actual
   */
  getSearchTerm(): string {
    return this.searchTermSubject.value;
  }

  /**
   * Limpia el término de búsqueda
   */
  clearSearch(): void {
    this.searchTermSubject.next('');
  }
}
