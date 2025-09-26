import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-cambiar-contra',
  standalone: false,
  templateUrl: './cambiar-contra.component.html',
  styleUrl: './cambiar-contra.component.css'
})
export class CambiarContraComponent implements AfterViewInit {

  constructor(
    public router: Router,
    public dialogService: DialogService,
  ) { }

  ngAfterViewInit(): void {
    this.setupCodeInputs();
  }

  private setupCodeInputs(): void {
    // Script para manejo de los inputs de código
    const codeInputs = document.querySelectorAll('.code-input') as NodeListOf<HTMLInputElement>;

    codeInputs.forEach((input, index) => {
        // Mover al siguiente input cuando se ingresa un número
        input.addEventListener('input', (e) => {
            const target = e.target as HTMLInputElement;
            if (target.value.length === 1 && index < codeInputs.length - 1) {
                codeInputs[index + 1].focus();
            }
        });

        // Mover al input anterior al presionar backspace
        input.addEventListener('keydown', (e) => {
            const target = e.target as HTMLInputElement;
            if (e.key === 'Backspace' && target.value === '' && index > 0) {
                codeInputs[index - 1].focus();
            }
        });

        // Solo permitir números
        input.addEventListener('input', (e) => {
            const target = e.target as HTMLInputElement;
            target.value = target.value.replace(/[^0-9]/g, '');
        });
    });
  }
}
