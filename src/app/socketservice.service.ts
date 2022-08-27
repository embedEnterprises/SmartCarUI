import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { WebsocketService } from './websocket.service';

export interface Message {
  messageContent: any;
}

@Injectable()
export class SocketService {
  public messages: Subject<Message>;
  public CHAT_URL = 'ws://192.168.3.100:80/ws';
  private intervalId;
  constructor(wscService: WebsocketService) {
    this.messages = <Subject<Message>>wscService.connect(this.CHAT_URL).pipe(
      map((response: MessageEvent): Message => {
        let content = JSON.parse(response.data);
        return {
          messageContent: content.messageContent,
        };
      })
    );
    this.messages.subscribe({
      error:()=>{
        console.log("hey there is error");
        wscService.close();
        this.intervalId = setInterval(()=>{
          console.log("connect");
          wscService.connect(this.CHAT_URL);
        } , 500);
      }
    });

    wscService.onOpen.subscribe({
      next : ()=> console.log("I have connected to this one")
    })
  }
}
