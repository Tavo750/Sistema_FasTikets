import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionLocalesComponent } from './gestion-locales.component';

describe('GestionLocalesComponent', () => {
  let component: GestionLocalesComponent;
  let fixture: ComponentFixture<GestionLocalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GestionLocalesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionLocalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
