import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

import { CompraEntradasComponent } from './compra-entradas.component';

describe('CompraEntradasComponent', () => {
  let component: CompraEntradasComponent;
  let fixture: ComponentFixture<CompraEntradasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompraEntradasComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompraEntradasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
