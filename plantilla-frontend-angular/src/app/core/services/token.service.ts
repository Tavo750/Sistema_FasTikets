import { Injectable } from '@angular/core';
import { SessionService } from '../../shared/services/session.service';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor(private sessionService: SessionService) { }

  /**
   * Obtiene el token del usuario actual
   */
  getToken(): string | null {
    const currentUser = this.sessionService.getCurrentUser();
    return currentUser?.token || null;
  }

  /**
   * Verifica si el token existe y no está expirado
   */
  isTokenValid(): boolean {
    const currentUser = this.sessionService.getCurrentUser();

    if (!currentUser || !currentUser.token || !currentUser.expiracion) {
      return false;
    }

    // Verificar si el token ha expirado
    const currentTime = Math.floor(Date.now() / 1000);
    return currentUser.expiracion > currentTime;
  }

  /**
   * Verifica si el token está próximo a expirar (dentro de 5 minutos)
   */
  isTokenExpiringSoon(): boolean {
    const currentUser = this.sessionService.getCurrentUser();

    if (!currentUser || !currentUser.expiracion) {
      return false;
    }

    const currentTime = Math.floor(Date.now() / 1000);
    const fiveMinutesInSeconds = 5 * 60;

    return (currentUser.expiracion - currentTime) <= fiveMinutesInSeconds;
  }

  /**
   * Obtiene el tiempo restante del token en segundos
   */
  getTokenTimeRemaining(): number {
    const currentUser = this.sessionService.getCurrentUser();

    if (!currentUser || !currentUser.expiracion) {
      return 0;
    }

    const currentTime = Math.floor(Date.now() / 1000);
    return Math.max(0, currentUser.expiracion - currentTime);
  }

  /**
   * Decodifica el payload del token JWT (sin verificar la firma)
   * NOTA: Solo para leer información, la validación debe hacerse en el backend
   */
  decodeTokenPayload(): any {
    const token = this.getToken();

    if (!token) {
      return null;
    }

    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch (error) {
      console.error('Error al decodificar token:', error);
      return null;
    }
  }

  /**
   * Obtiene información del usuario desde el token
   */
  getUserInfoFromToken(): any {
    const payload = this.decodeTokenPayload();

    if (!payload) {
      return null;
    }

    return {
      userId: payload.sub || payload.idUsuario,
      email: payload.email,
      role: payload.rol || payload.role,
      exp: payload.exp,
      iat: payload.iat
    };
  }
}
