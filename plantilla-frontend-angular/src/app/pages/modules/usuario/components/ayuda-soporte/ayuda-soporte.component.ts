import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ayuda-soporte',
  standalone: false,
  templateUrl: './ayuda-soporte.component.html',
  styleUrls: ['./ayuda-soporte.component.css']
})
export class AyudaSoporteComponent {
  constructor(private router: Router) {}

  irASiguiente(): void {
   this.router.navigate(['/usuario/ayudaSoporte/asuntoSoporte']);
  }
}
