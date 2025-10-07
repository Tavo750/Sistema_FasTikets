import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogErroresComponent } from './log-errores.component';

describe('LogErroresComponent', () => {
  let component: LogErroresComponent;
  let fixture: ComponentFixture<LogErroresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LogErroresComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LogErroresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
