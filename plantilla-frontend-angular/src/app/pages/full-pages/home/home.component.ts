import { Component, HostListener } from '@angular/core';
import { Usuario } from '../../../core/interfaces/login.interface';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  isSidebarOpen = true; // Inicialmente abierto
  isSidebarOpenMobile = false; // Inicialmente cerrado
  isMobile = false;

  usuario: Usuario | null = null;

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit(): void {

    this.usuario = this.authService.getDecodedToken();

    const windowWidth = window.innerWidth;

    if (windowWidth < 768) {
      this.isSidebarOpen = false;
      this.isSidebarOpenMobile = false;
      this.isMobile = true;
    } else {
      this.isSidebarOpen = true;
      this.isSidebarOpenMobile = false;
      this.isMobile = false;
    }
  }

  toggleSidebar() {
    if (window.innerWidth < 768) {
      this.isSidebarOpenMobile = !this.isSidebarOpenMobile;
    } else {
      this.isSidebarOpen = !this.isSidebarOpen;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (event.target.innerWidth >= 768) {
      this.isSidebarOpen = true; // Desktop: sidebar visible
      this.isSidebarOpenMobile = false; // Asegura que el drawer esté cerrado
      this.isMobile = false;
    } else {
      this.isSidebarOpen = false;
      this.isMobile = true;
    }
  }
}
