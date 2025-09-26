import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  canActivate(): Observable<boolean> {

    if (environment.useMockAuth) {
      return of(true); // En local, siempre permite el acceso
    }

    return this.authService.verificarSesion().pipe(
      map(response => {
        if (response.ok && response.accessToken) {
          this.authService.saveAccessToken(response.accessToken);
          return true;
        } else {
          window.location.href = 'https://nocb.nettalco.com.pe/intranet/sso/menu';
          return false;
        }
      }),
      catchError(() => {
        window.location.href = 'https://nocb.nettalco.com.pe/intranet/sso/menu';
        return of(false);
      })
    );
  }

}
