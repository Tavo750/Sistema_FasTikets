import { TestBed } from '@angular/core/testing';
import { MessageService as PrimeMessageService } from 'primeng/api';

import { MessageService } from './message.service';

describe('MessageService', () => {
  let service: MessageService;

  const mockPrimeMessageService = {
    add: jasmine.createSpy('add'),
    clear: jasmine.createSpy('clear')
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: PrimeMessageService, useValue: mockPrimeMessageService }
      ]
    });
    service = TestBed.inject(MessageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
