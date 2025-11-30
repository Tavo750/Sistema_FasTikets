import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfiguracionGeneralComponent } from './configuracion-general.component';

describe('ConfiguracionGeneralComponent', () => {
  let component: ConfiguracionGeneralComponent;
  let fixture: ComponentFixture<ConfiguracionGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfiguracionGeneralComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfiguracionGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
