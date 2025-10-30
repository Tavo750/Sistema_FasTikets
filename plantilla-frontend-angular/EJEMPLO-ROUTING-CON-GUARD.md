// Ejemplo de cómo usar el TokenGuard en las rutas
// Este es un ejemplo para el archivo de routing

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TokenGuard } from '../core/guards/token.guard';

const routes: Routes = [
  {
    path: 'administrador',
    canActivate: [TokenGuard],
    data: { roles: ['ADMINISTRADOR'] }, // Solo administradores
    loadChildren: () => import('./modules/administrador/administrador.module').then(m => m.AdministradorModule)
  },
  {
    path: 'usuario',
    canActivate: [TokenGuard],
    data: { roles: ['CLIENTE', 'USUARIO'] }, // Clientes y usuarios
    loadChildren: () => import('./modules/usuario/usuario.module').then(m => m.UsuarioModule)
  },
  {
    path: 'perfil',
    canActivate: [TokenGuard], // Cualquier usuario autenticado
    loadChildren: () => import('./modules/perfil/perfil.module').then(m => m.PerfilModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProtectedRoutingModule { }
