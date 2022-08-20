import { Injectable } from '@angular/core';
import * as Rj from 'rxjs';
import { Observable, Observer, Subject } from 'rxjs';

@Injectable()
export class WebsocketService {
  constructor() {}

  private subject: Rj.Subject<MessageEvent>;
  public wsc;
  private intervalId;
  private openSubject = new Subject<Event>();
  onOpen: Observable<Event>  = this.openSubject;



  public connect(url): Rj.Subject<MessageEvent> {
    if (!this.subject) {
      console.log("not a ");
      this.subject = this.create(url);
      console.log('Successfully connected To: ' + url);
    }
    return this.subject;
  }

  public create(url): Rj.Subject<MessageEvent> {
    this.wsc = new WebSocket(url);
    let observable =new Observable((obs: Observer<MessageEvent>) => {
      this.wsc.onmessage = obs.next.bind(obs);
      this.wsc.onerror = obs.error.bind(obs);
      this.wsc.onclose = obs.complete.bind(obs);
      this.wsc.onopen = e => this.openSubject.next(e);
      return this.wsc.close.bind(this.wsc);
    });
    let observer = {
      next: (data: Object) => {
        if (this.wsc.readyState === WebSocket.OPEN) {
          this.wsc.send(JSON.stringify(data));
        }
      },
    };
    return Rj.Subject.create(observer, observable);
  }
  readyState (){
    return this.wsc.readyState
  }

  close (){
    console.log(this.subject);
    this.subject.unsubscribe();
  }

}
