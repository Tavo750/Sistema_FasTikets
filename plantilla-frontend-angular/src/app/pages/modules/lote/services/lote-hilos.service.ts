import { Injectable } from '@angular/core';
import * as global from '../../../../global'
import * as constantes from '../constantes'
import { HttpClient } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { ListaGruposHiloResponse } from '../interfaces/lote-hilos-response';
import { HttpUtilsService } from '../../../../shared/services/http-utils.service';

@Injectable({
  providedIn: 'root'
})
export class LoteHilosService {

  url: string = global.url + constantes.urlComplemento;

  constructor(
    private http: HttpClient,
    private httpUtils: HttpUtilsService
  ) { }

  listaGruposHilo(): Observable<ListaGruposHiloResponse> {
    return this.http.get<ListaGruposHiloResponse>(
      this.url + 'listGroupYarns'
    ).pipe(catchError(this.httpUtils.handleError));
  }

}
