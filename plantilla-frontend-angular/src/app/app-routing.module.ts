import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './core/components/layout/layout.component';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'lote', component: LayoutComponent, canActivate: [AuthGuard], children: [
      { path: '', loadChildren: () => import('./pages/modules/lote/lote.module').then(m => m.LoteModule) },
    ],
  },
  {
    path: 'logo', component: LayoutComponent, canActivate: [AuthGuard], children: [
      { path: '', loadChildren: () => import('./pages/modules/logo/logo.module').then(m => m.LogoModule) },
    ]
  },
  {
    path: 'facturacion', component: LayoutComponent, canActivate: [AuthGuard], children: [
      { path: '', loadChildren: () => import('./pages/modules/facturacion/facturacion.module').then(m => m.FacturacionModule) },
    ]
  },
  {
    path: 'inicio', component: LayoutComponent, canActivate: [AuthGuard], children: [
      { path: '', loadChildren: () => import('./pages/modules/home/home.module').then(m => m.HomeModule) },
    ]
  },
  {
    path: 'cotizacion', component: LayoutComponent, canActivate: [AuthGuard], children: [
      { path: '', loadChildren: () => import('./pages/modules/cotizacion/cotizacion.module').then(m => m.CotizacionModule) },
    ]
  },
  { path: 'login', loadChildren: () => import('./pages/full-pages/login/login.module').then(m => m.LoginModule) },
  { path: 'error', loadChildren: () => import('./pages/full-pages/error/error.module').then(m => m.ErrorModule) },
  { path: '**', redirectTo: 'error' },
];


@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
