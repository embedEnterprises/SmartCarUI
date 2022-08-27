import { Injectable } from '@angular/core';
import { retry, RetryConfig } from 'rxjs';
import { webSocket } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root',
})
export class WebsocketRxjsService {
  private socket;
  private connected;
  private url = 'ws://192.168.0.105:80/ws';
  private retryConfig : RetryConfig = {
    count : 10,
    delay : 50
  };
  constructor() {
    this.socket = webSocket({
      url: this.url,
      openObserver: {
        next: (val: any) => {
          console.log('opened   ' , val);
          this.connected = true;
        },
      },
      closeObserver: {
        next: (val: any) => {
          console.log('closed  ' , val);
          this.connected = false;
        },
      },
    });

    this.socket.pipe(retry(this.retryConfig)).subscribe(
      (msg) => console.log('message received: ' + msg),
      (err) => console.log(err),
      () => console.log('complete')
    );
  }

  public send(data : Object){
    this.socket.next(data);
  }

  public isConnected(){
    return this.connected;
  }

}
