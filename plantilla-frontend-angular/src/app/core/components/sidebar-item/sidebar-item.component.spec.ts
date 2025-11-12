import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, NavigationEnd } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { SidebarItemComponent } from './sidebar-item.component';

describe('SidebarItemComponent', () => {
  let component: SidebarItemComponent;
  let fixture: ComponentFixture<SidebarItemComponent>;

  beforeEach(async () => {
    const mockRouter = {
      navigate: jasmine.createSpy('navigate'),
      url: '/home',
      events: of(new NavigationEnd(1, '/home', '/home'))
    };

    await TestBed.configureTestingModule({
      declarations: [SidebarItemComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: Router, useValue: mockRouter }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidebarItemComponent);
    component = fixture.componentInstance;
    
    // Inicializar propiedades requeridas
    component.item = { label: 'Test', routerLink: '/test' };
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
