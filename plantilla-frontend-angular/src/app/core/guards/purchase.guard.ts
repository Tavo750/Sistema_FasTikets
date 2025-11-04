import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from '../services/login.service';
import { SessionService } from '../../shared/services/session.service';

@Injectable({
  providedIn: 'root'
})
export class PurchaseGuard implements CanActivate {

  constructor(
    private loginService: LoginService,
    private sessionService: SessionService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {

    // Verificar si el usuario está autenticado
    const isLoggedIn = this.loginService.isLoggedIn();
    const isAuthenticated = this.sessionService.isAuthenticated();
    const hasValidToken = this.loginService.isTokenValid();

    // Si está autenticado, permitir acceso
    if (isLoggedIn && isAuthenticated && hasValidToken) {
      return true;
    }

    // Si no está autenticado, redirigir al login con la URL de retorno
    this.router.navigate(['/login'], {
      queryParams: { returnUrl: state.url }
    });
    return false;
  }
}
