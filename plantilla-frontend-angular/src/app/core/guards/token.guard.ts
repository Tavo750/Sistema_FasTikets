import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { SessionService } from '../../shared/services/session.service';
import { TokenService } from '../services/token.service';
import { MessageService } from '../services/message.service';

@Injectable({
  providedIn: 'root'
})
export class TokenGuard implements CanActivate {

  constructor(
    private sessionService: SessionService,
    private tokenService: TokenService,
    private router: Router,
    private messageService: MessageService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // Verificar si hay un usuario autenticado
    if (!this.sessionService.isAuthenticated()) {
      this.messageService.error(
        'Debe iniciar sesión para acceder a esta página.',
        'Acceso Restringido'
      );
      this.router.navigate(['/login']);
      return false;
    }

    // Verificar si el token es válido
    if (!this.tokenService.isTokenValid()) {
      this.messageService.error(
        'Su sesión ha expirado. Por favor, inicie sesión nuevamente.',
        'Sesión Expirada'
      );
      this.sessionService.clearUser();
      this.router.navigate(['/login']);
      return false;
    }

    // Verificar si el token está próximo a expirar y mostrar advertencia
    if (this.tokenService.isTokenExpiringSoon()) {
      const timeRemaining = Math.ceil(this.tokenService.getTokenTimeRemaining() / 60);
      this.messageService.warn(
        `Su sesión expirará en ${timeRemaining} minuto(s). Guarde su trabajo.`,
        'Sesión por Expirar'
      );
    }

    // Verificar roles si se especifican en la ruta
    const requiredRoles = route.data?.['roles'] as string[];
    if (requiredRoles && requiredRoles.length > 0) {
      const userRole = this.sessionService.getUserRole();

      if (!userRole || !requiredRoles.includes(userRole)) {
        this.messageService.error(
          'No tiene permisos suficientes para acceder a esta página.',
          'Acceso Denegado'
        );
        this.router.navigate(['/dashboard']); // O la página principal
        return false;
      }
    }

    return true;
  }
}
