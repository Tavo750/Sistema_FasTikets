import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import * as global from '../../global';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly ACCESS_TOKEN_KEY = 'SSO__accessToken';
  private url = global.urlAuth;

  private tokenSubject = new BehaviorSubject<string | null>(this.getAccessToken());
  token$ = this.tokenSubject.asObservable();

  private userSubject = new BehaviorSubject<any | null>(this.getDecodedToken());
  user$ = this.userSubject.asObservable();

  constructor(
    private http: HttpClient
  ) { }

  verificarSesion(): Observable<any> {
    const payload = {
      codisist: global.sistema,
    };


    return this.http.post<any>(`${this.url}api/verificar-sesion`, payload, {
      withCredentials: true
    }).pipe(
      tap(resp => {
        if (resp.accessToken) {
          this.saveAccessToken(resp.accessToken);
        }
      }),
      catchError(err => {
        this.removeAccessToken();
        return throwError(() => err);
      })
    );
  }

  saveAccessToken(token: string): void {
    sessionStorage.setItem(this.ACCESS_TOKEN_KEY, token);
    this.tokenSubject.next(token);
    this.userSubject.next(this.getDecodedToken());
  }

  removeAccessToken(): void {
    sessionStorage.removeItem(this.ACCESS_TOKEN_KEY);
    this.tokenSubject.next(null);
    this.userSubject.next(null);
  }

  getAccessToken(): string | null {
    return sessionStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  getDecodedToken(): any | null {
    const token = this.getAccessToken();
    if (!token) return null;

    try {
      return jwtDecode(token);
    } catch (e) {
      console.error('Error al decodificar token', e);
      return null;
    }
  }

  isAccessTokenExpired(): boolean {
    const decoded: any = this.getDecodedToken();
    if (!decoded?.exp) return true;

    const now = Math.floor(Date.now() / 1000);
    return decoded.exp < now;
  }

  isLoggedIn(): boolean {
    return !!this.getAccessToken() && !this.isAccessTokenExpired();
  }

  getUser(): any {
    return this.userSubject.value;
  }
}
