import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AgregaFavoritoResponse, FavoritosResponse, QuitaFavoritoResponse } from '../interfaces/favoritos.interface';
import { baseUrl } from '../../global';

@Injectable({
  providedIn: 'root'
})
export class FavoritosService {


  constructor(private http: HttpClient) { }

  GetListarEventoFavorito(): Observable<FavoritosResponse> {
    return this.http.get<FavoritosResponse>(`${baseUrl}`);
  }

  PostAgregaEventoFavorito(id: number): Observable<AgregaFavoritoResponse> {
    return this.http.post<AgregaFavoritoResponse>(`${baseUrl}/${id}`, {});
  }
  
  DeleteEliminaEventoFavorito(id: number): Observable<QuitaFavoritoResponse> {
    return this.http.delete<QuitaFavoritoResponse>(`${baseUrl}/${id}`);
  }
  
}
