import { TestBed } from '@angular/core/testing';
import { ConfirmationService, MessageService } from 'primeng/api';

import { ConfirmPopupService } from './confirm-popup.service';

describe('ConfirmPopupService', () => {
  let service: ConfirmPopupService;

  const mockConfirmationService = {
    confirm: jasmine.createSpy('confirm'),
    close: jasmine.createSpy('close')
  };

  const mockMessageService = {
    add: jasmine.createSpy('add'),
    clear: jasmine.createSpy('clear')
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: ConfirmationService, useValue: mockConfirmationService },
        { provide: MessageService, useValue: mockMessageService }
      ]
    });
    service = TestBed.inject(ConfirmPopupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
