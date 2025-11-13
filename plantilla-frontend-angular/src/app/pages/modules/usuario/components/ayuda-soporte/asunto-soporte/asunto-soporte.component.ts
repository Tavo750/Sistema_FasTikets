import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-asunto-soporte',
  standalone: false,
  templateUrl: './asunto-soporte.component.html',
  styleUrls: ['./asunto-soporte.component.css']
})
export class AsuntoSoporteComponent {
  asunto: string = '';
  mensaje: string = '';
  // Permitir letras (incluyendo tildes), números, espacios y signos de puntuación comunes
  readonly asuntoPattern: RegExp = /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s\-\,\?\!\.\'\"\:\(\)]+$/;

  validarAsunto(text: string): boolean {
    if (!text) return false;
    const trimmed = text.trim();
    if (trimmed.length < 3) return false;
    return this.asuntoPattern.test(trimmed);
  }

  enviarCorreo(form?: NgForm): void {
    // Si se pasa el formulario, validar su estado
    if (form && !form.valid) {
      // marcar controles como tocados para mostrar errores
      Object.values(form.controls).forEach(control => control.markAsTouched());
      return;
    }

    // Validación extra por si se llama programáticamente
    if (!this.validarAsunto(this.asunto)) {
      alert('El asunto no es válido. Usa al menos 3 caracteres y evita símbolos raros.');
      return;
    }

    // Aquí luego puedes integrar el servicio que mande el correo al backend
    console.log('Asunto:', this.asunto.trim());
    console.log('Mensaje:', this.mensaje.trim());

    alert('Tu mensaje ha sido enviado. ¡Gracias por contactarnos!');

    // Limpia el formulario
    this.asunto = '';
    this.mensaje = '';
    if (form) form.resetForm();
  }
}
