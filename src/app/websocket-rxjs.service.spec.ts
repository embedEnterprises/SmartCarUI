import { TestBed } from '@angular/core/testing';

import { WebsocketRxjsService } from './websocket-rxjs.service';

describe('WebsocketRxjsService', () => {
  let service: WebsocketRxjsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebsocketRxjsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
