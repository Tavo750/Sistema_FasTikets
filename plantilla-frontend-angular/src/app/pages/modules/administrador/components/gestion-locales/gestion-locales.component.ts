import { Component } from '@angular/core';

interface Local {
  id: number;
  nombre: string;
  direccion: string;
  distrito: string;
  aforo: number;
  estado: string;
}

@Component({
  selector: 'app-gestion-locales',
  standalone: false,
  templateUrl: './gestion-locales.component.html',
  styleUrl: './gestion-locales.component.css'
})
export class GestionLocalesComponent {
  
}
