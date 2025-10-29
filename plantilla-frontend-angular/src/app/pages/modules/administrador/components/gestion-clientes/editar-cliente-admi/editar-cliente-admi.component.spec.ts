import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarClienteAdmiComponent } from './editar-cliente-admi.component';

describe('EditarClienteAdmiComponent', () => {
  let component: EditarClienteAdmiComponent;
  let fixture: ComponentFixture<EditarClienteAdmiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditarClienteAdmiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarClienteAdmiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
