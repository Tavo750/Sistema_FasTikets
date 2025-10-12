import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Persona } from '../../core/interfaces/login.interface';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private readonly USER_KEY = 'current_user';
  private userSubject = new BehaviorSubject<Persona | null>(null);
  public user$ = this.userSubject.asObservable();

  constructor() {
    // Cargar usuario del localStorage al inicializar el servicio
    this.loadUserFromStorage();
  }

  /**
   * Guarda la información del usuario en el storage y actualiza el observable
   */
  setUser(persona: Persona): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(persona));
    this.userSubject.next(persona);
  }

  /**
   * Obtiene el usuario actual
   */
  getCurrentUser(): Persona | null {
    return this.userSubject.value;
  }

  /**
   * Obtiene el rol del usuario actual
   */
  getUserRole(): string | null {
    const user = this.getCurrentUser();
    return user?.rol || null;
  }

  /**
   * Verifica si el usuario tiene un rol específico
   */
  hasRole(role: string): boolean {
    const userRole = this.getUserRole();
    return userRole === role;
  }

  /**
   * Verifica si es administrador
   */
  isAdmin(): boolean {
    return this.hasRole('ADMINISTRADOR');
  }

  /**
   * Verifica si es cliente
   */
  isClient(): boolean {
    return this.hasRole('CLIENTE');
  }

  /**
   * Limpia la sesión del usuario
   */
  clearUser(): void {
    localStorage.removeItem(this.USER_KEY);
    this.userSubject.next(null);
  }

  /**
   * Verifica si hay un usuario autenticado
   */
  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  /**
   * Carga el usuario del localStorage
   */
  private loadUserFromStorage(): void {
    try {
      const userJson = localStorage.getItem(this.USER_KEY);
      if (userJson) {
        const user = JSON.parse(userJson) as Persona;
        this.userSubject.next(user);
      }
    } catch (error) {
      console.error('Error al cargar usuario del storage:', error);
      this.clearUser();
    }
  }
}
