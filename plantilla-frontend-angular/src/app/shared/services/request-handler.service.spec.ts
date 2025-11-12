import { TestBed } from '@angular/core/testing';
import { MessageService } from 'primeng/api';

import { RequestHandlerService } from './request-handler.service';

describe('RequestHandlerService', () => {
  let service: RequestHandlerService;

  const mockMessageService = {
    add: jasmine.createSpy('add'),
    clear: jasmine.createSpy('clear')
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: MessageService, useValue: mockMessageService }
      ]
    });
    service = TestBed.inject(RequestHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
