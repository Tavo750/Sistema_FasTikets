import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { fromEvent, merge, Observable, timer, Subscription } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { DialogoComponent } from '../../shared/components/dialogo/dialogo.component';
import * as global from '../../global'

@Injectable({
  providedIn: 'root',
})
export class InactivityService {

  private userActivityEvents$: Observable<Event>;
  private timer$: Observable<number>;
  private subscription: Subscription = new Subscription();
  // private inactivityTime = 2 * 1000; // 2 segundos
  private inactivityTime = global.tiempoInactividadAlarma;
  ref: DynamicDialogRef | undefined;

  constructor(
    private router: Router,
    private ngZone: NgZone,
    public dialogService: DialogService,
  ) {
    // Escuchar eventos de interacción del usuario (click, keypress, mousemove, touchstart)
    this.userActivityEvents$ = merge(
      fromEvent(document, 'mousemove'),
      fromEvent(document, 'click'),
      fromEvent(document, 'keypress'),
      fromEvent(document, 'touchstart')
    );

    // Iniciar el temporizador de inactividad
    this.timer$ = timer(this.inactivityTime);
  }

  startWatching(): void {
    this.ngZone.runOutsideAngular(() => {
      // Suscribirse a los eventos de usuario y reiniciar el temporizador cuando haya actividad
      this.subscription = this.userActivityEvents$
        .pipe(
          // tap(() => console.log('User is active')),
          switchMap(() => this.timer$),
          tap(() => {
            this.ngZone.run(() => this.handleInactivity());
          })
        )
        .subscribe();
    });
  }

  stopWatching(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private handleInactivity(): void {
    sessionStorage.clear();

    this.ref = this.dialogService.open(DialogoComponent, {
      header: '¡Aviso!',
      width: '400px',
      modal: true,
      closable: true,
      focusOnShow: true,
      data: {
        mensaje: 'Se ha cerrado la sesión por inactividad',
        severidad: 'warn'
      },
    });

    this.ref.onClose.subscribe(() => {
      this.router.navigate(['/']);
    });

  }
}
