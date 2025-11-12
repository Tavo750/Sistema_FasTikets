import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

import { CodigosPromocionalesComponent } from './codigos-promocionales.component';

describe('CodigosPromocionalesComponent', () => {
  let component: CodigosPromocionalesComponent;
  let fixture: ComponentFixture<CodigosPromocionalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CodigosPromocionalesComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CodigosPromocionalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
