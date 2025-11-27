import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CambiarAAdminComponent } from './cambiar-a-admin.component';

describe('CambiarAAdminComponent', () => {
  let component: CambiarAAdminComponent;
  let fixture: ComponentFixture<CambiarAAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CambiarAAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CambiarAAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
