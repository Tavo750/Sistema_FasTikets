import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsuntoSoporteComponent } from './asunto-soporte.component';

describe('AsuntoSoporteComponent', () => {
  let component: AsuntoSoporteComponent;
  let fixture: ComponentFixture<AsuntoSoporteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AsuntoSoporteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsuntoSoporteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
