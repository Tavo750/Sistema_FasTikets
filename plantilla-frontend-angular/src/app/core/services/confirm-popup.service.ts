import { Injectable } from '@angular/core';
import { MessageService } from './message.service';
import { ConfirmationService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class ConfirmPopupService {

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }



    confirmDelete(event: any, mensaje: string, onConfirm: () => void, onReject?: () => void) {
        this.confirmationService.confirm({
            target: event.currentTarget || event.target,
            message: mensaje,
            icon: 'pi pi-exclamation-triangle',
            rejectButtonProps: {
                label: 'No',
                severity: 'secondary',
                outlined: true
            },
            acceptButtonProps: {
                label: 'Si',
                severity: 'danger'
            },
            accept: () => {
                onConfirm();
            },
            reject: () => {
                if (onReject) {
                    onReject();
                }
            }
        });
    }
}
