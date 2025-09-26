import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { FooterComponent } from './components/footer/footer.component';
import { LayoutComponent } from './components/layout/layout.component';
import { AppRoutingModule } from '../app-routing.module';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { SharedModule } from 'primeng/api';
import { SidebarItemComponent } from './components/sidebar-item/sidebar-item.component';


@NgModule({
  declarations: [
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    LayoutComponent,
    SidebarItemComponent,
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    PrimeNgModule,
    SharedModule,
  ]
})
export class CoreModule { }
