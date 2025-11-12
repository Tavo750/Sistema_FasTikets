import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

import { DialogoComponent } from './dialogo.component';

describe('DialogoComponent', () => {
  let component: DialogoComponent;
  let fixture: ComponentFixture<DialogoComponent>;

  const mockDynamicDialogRef = {
    close: jasmine.createSpy('close'),
    destroy: jasmine.createSpy('destroy')
  };

  const mockDynamicDialogConfig = {
    data: {},
    header: 'Test',
    width: '50%'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DialogoComponent],
      providers: [
        { provide: DynamicDialogRef, useValue: mockDynamicDialogRef },
        { provide: DynamicDialogConfig, useValue: mockDynamicDialogConfig }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
