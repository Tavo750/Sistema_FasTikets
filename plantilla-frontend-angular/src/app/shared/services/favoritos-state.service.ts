import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { FavoritosService } from '../../core/services/favoritos.service';
import { SessionService } from './session.service';

@Injectable({
  providedIn: 'root'
})
export class FavoritosStateService {
  private favoritosSubject = new BehaviorSubject<number[]>([]);
  private cargandoSubject = new BehaviorSubject<boolean>(false);

  public favoritos$ = this.favoritosSubject.asObservable();
  public cargando$ = this.cargandoSubject.asObservable();

  constructor(
    private favoritosService: FavoritosService,
    private sessionService: SessionService
  ) {
    // Cargar favoritos al inicializar si hay usuario y no es administrador
    const usuario = this.sessionService.getCurrentUser();
    if (usuario && usuario.rol !== 'ADMINISTRADOR') {
      this.cargarFavoritos();
    }

    // Suscribirse a cambios de usuario
    this.sessionService.user$.subscribe(user => {
      if (user && user.rol !== 'ADMINISTRADOR') {
        this.cargarFavoritos();
      } else {
        this.limpiarFavoritos();
      }
    });
  }

  /**
   * Carga la lista completa de favoritos desde el backend
   */
  cargarFavoritos(): void {
    this.cargandoSubject.next(true);
    
    this.favoritosService.GetListarEventoFavorito().subscribe({
      next: (response) => {
        this.cargandoSubject.next(false);
        if (response.ok && response.data) {
          const favoritosIds = response.data.map(fav => fav.idEvento);
          this.favoritosSubject.next(favoritosIds);
        } else {
          this.favoritosSubject.next([]);
        }
      },
      error: (error) => {
        this.cargandoSubject.next(false);
        console.error('Error al cargar favoritos:', error);
        this.favoritosSubject.next([]);
      }
    });
  }

  /**
   * Agrega un evento a favoritos
   */
  agregarFavorito(eventoId: number): Observable<boolean> {
    return new Observable(observer => {
      this.favoritosService.PostAgregaEventoFavorito(eventoId).subscribe({
        next: (response) => {
          if (response.ok) {
            const favoritosActuales = this.favoritosSubject.value;
            if (!favoritosActuales.includes(eventoId)) {
              this.favoritosSubject.next([...favoritosActuales, eventoId]);
            }
            observer.next(true);
            observer.complete();
          } else {
            observer.next(false);
            observer.complete();
          }
        },
        error: (error) => {
          observer.error(error);
        }
      });
    });
  }

  /**
   * Quita un evento de favoritos
   */
  quitarFavorito(eventoId: number): Observable<boolean> {
    return new Observable(observer => {
      this.favoritosService.DeleteEliminaEventoFavorito(eventoId).subscribe({
        next: (response) => {
          if (response.ok) {
            const favoritosActuales = this.favoritosSubject.value;
            this.favoritosSubject.next(favoritosActuales.filter(id => id !== eventoId));
            observer.next(true);
            observer.complete();
          } else {
            observer.next(false);
            observer.complete();
          }
        },
        error: (error) => {
          observer.error(error);
        }
      });
    });
  }

  /**
   * Verifica si un evento está en favoritos
   */
  esFavorito(eventoId: number): boolean {
    return this.favoritosSubject.value.includes(eventoId);
  }

  /**
   * Obtiene la lista actual de favoritos
   */
  getFavoritos(): number[] {
    return this.favoritosSubject.value;
  }

  /**
   * Obtiene el número de favoritos
   */
  getContadorFavoritos(): number {
    return this.favoritosSubject.value.length;
  }

  /**
   * Limpia la lista de favoritos
   */
  limpiarFavoritos(): void {
    this.favoritosSubject.next([]);
  }

  /**
   * Alterna el estado de favorito de un evento
   */
  toggleFavorito(eventoId: number): Observable<{ agregado: boolean, exito: boolean }> {
    return new Observable(observer => {
      const esFavorito = this.esFavorito(eventoId);
      
      if (esFavorito) {
        this.quitarFavorito(eventoId).subscribe({
          next: (exito) => {
            observer.next({ agregado: false, exito });
            observer.complete();
          },
          error: (error) => observer.error(error)
        });
      } else {
        this.agregarFavorito(eventoId).subscribe({
          next: (exito) => {
            observer.next({ agregado: true, exito });
            observer.complete();
          },
          error: (error) => observer.error(error)
        });
      }
    });
  }
}