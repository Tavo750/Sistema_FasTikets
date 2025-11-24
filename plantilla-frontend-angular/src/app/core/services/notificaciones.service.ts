import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { baseUrl } from '../../global';
import { NotificacionesResponse } from '../interfaces/notificaciones.interface';

@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {

  constructor(private http: HttpClient) { }

  GetListaNotificaciones(): Observable<NotificacionesResponse> {
    return this.http.get<NotificacionesResponse>(`${baseUrl}/notificaciones`);
  }
}
