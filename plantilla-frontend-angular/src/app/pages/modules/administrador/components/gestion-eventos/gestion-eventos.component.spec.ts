import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

import { GestionEventosComponent } from './gestion-eventos.component';

describe('GestionEventosComponent', () => {
  let component: GestionEventosComponent;
  let fixture: ComponentFixture<GestionEventosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GestionEventosComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionEventosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
