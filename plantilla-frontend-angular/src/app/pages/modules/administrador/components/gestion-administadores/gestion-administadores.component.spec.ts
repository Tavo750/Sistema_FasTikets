import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionAdministadoresComponent } from './gestion-administadores.component';

describe('GestionAdministadoresComponent', () => {
  let component: GestionAdministadoresComponent;
  let fixture: ComponentFixture<GestionAdministadoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GestionAdministadoresComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionAdministadoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
