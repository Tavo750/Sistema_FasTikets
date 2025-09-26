import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getAccessToken();
    let cloned = req;

    if (token) {
      cloned = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(cloned).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 419) {
          // Intentar renovar token
          return this.authService.verificarSesion().pipe(
            switchMap((res: any) => {
              const newToken = this.authService.getAccessToken();
              if (newToken) {
                const retried = req.clone({
                  setHeaders: {
                    Authorization: `Bearer ${newToken}`
                  }
                });
                return next.handle(retried);
              }
              return throwError(() => error);
            }),
            catchError(err => {
              this.authService.removeAccessToken(); // limpieza si falla
              return throwError(() => err);
            })
          );
        }

        return throwError(() => error);
      })
    );
  }
}
