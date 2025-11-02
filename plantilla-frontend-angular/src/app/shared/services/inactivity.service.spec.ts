import { TestBed } from '@angular/core/testing';
import { DialogService } from 'primeng/dynamicdialog';

import { InactivityService } from './inactivity.service';

describe('InactivityService', () => {
  let service: InactivityService;

  const mockDialogService = {
    open: jasmine.createSpy('open'),
    close: jasmine.createSpy('close')
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: DialogService, useValue: mockDialogService }
      ]
    });
    service = TestBed.inject(InactivityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
