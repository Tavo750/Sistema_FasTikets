import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisEntradasComponent } from './mis-entradas.component';

describe('MisEntradasComponent', () => {
  let component: MisEntradasComponent;
  let fixture: ComponentFixture<MisEntradasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MisEntradasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MisEntradasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
