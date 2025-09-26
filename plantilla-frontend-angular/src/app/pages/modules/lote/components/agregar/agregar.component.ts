import { Component, OnInit } from '@angular/core';
import { LoteHilosService } from '../../services/lote-hilos.service';
import { LoadingService } from '../../../../../shared/services/loading.service';
import { MessageService } from 'primeng/api';
import { GrupoHilo } from '../../interfaces/lote-hilos-response';
import { RequestHandlerService } from '../../../../../shared/services/request-handler.service';

@Component({
  selector: 'app-agregar',
  standalone: false,
  templateUrl: './agregar.component.html',
  styleUrl: './agregar.component.css'
})
export class AgregarComponent implements OnInit {

  lotes: GrupoHilo[] = [];

  constructor(
    private requestHandler: RequestHandlerService,
    private loteHilosService: LoteHilosService,
  ) { }

  ngOnInit(): void {
    this.obtenerLotesHilo();
  }

  obtenerLotesHilo() {
    this.requestHandler.handle(
      this.loteHilosService.listaGruposHilo()
    ).subscribe({
      next: (resp) => {
        this.lotes = resp.data;
        console.log(resp)
      }
    })
  }

}
