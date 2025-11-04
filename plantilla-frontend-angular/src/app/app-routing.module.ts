import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './core/components/layout/layout.component';
import { AuthGuard } from './core/guards/auth.guard';
//import { HomeComponent } from './pages/full-pages/home - eliminar/home.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

   // ========== INICIO (PÚBLICO) ==================================================================
  {
    path: 'home',
    component: LayoutComponent,
    loadChildren: () => import('./pages/modules/home/home.module').then(m => m.HomeModule)
  },
  //=========================================================================================

  // ========== USUARIO (PROTEGIDO) ==================================================================
  {
    path: 'usuario',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/modules/usuario/usuario.module').then(m => m.UsuarioModule),
  },
  //=========================================================================================

  // ========== ADMINISTRADOR (PROTEGIDO) ==================================================================
  {
    path: 'administrador',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/modules/administrador/administrador.module').then(m => m.AdministradorModule),
  },
  //=========================================================================================



  // ========== LOGIN ==================================================================
  { path: 'login', loadChildren: () => import('./pages/full-pages/login/login.module').then(m => m.LoginModule) },
  { path: 'error', loadChildren: () => import('./pages/full-pages/error/error.module').then(m => m.ErrorModule) },
  //=========================================================================================

  // ========== REGISTRO DE USUARIO Y CONTRASEÑA ==========================================================
  { path: 'crear_usuario', loadChildren: () => import('./pages/full-pages/crear-usuario/crear-usuario.module').then(m => m.CrearUsuarioModule) },
  { path: 'cambiar_contra', loadChildren: () => import('./pages/full-pages/cambiar-contra/cambiar-contra.module').then(m => m.CambiarContraModule) },
  { path: '**', redirectTo: 'error' },
  //=========================================================================================
];


@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
