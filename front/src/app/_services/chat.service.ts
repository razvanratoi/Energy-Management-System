import {Injectable} from '@angular/core';
import {HttpTransportType, HubConnection, HubConnectionBuilder} from "@microsoft/signalr";
import {Message} from "../_models/message";
import {Observable, Observer} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  hubConnection!: HubConnection;

  constructor() {
  }

  startConnection() {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl('http://localhost:6090/chatHub', {
        skipNegotiation: true,
        transport: HttpTransportType.WebSockets
      })
      .build();

    this.hubConnection.start().then(() => {
      console.log('Connection started');
    }).catch(err => console.error('Error while starting connection: ' + err));
  }

  sendMessage(message: Message) {
    this.hubConnection.invoke('SendMessage', message)
      .catch(err => console.error(err));
  }

  seenMessage(message: Message) {
    this.hubConnection.invoke('SeenMessage', message)
      .catch(err => console.error(err));
  }

  alertTyping(message: Message) {
    this.hubConnection.invoke('AlertTyping', message)
      .catch(err => console.error(err));
  }

  adminReceiveMessage() {
    return new Observable<Message>((observer: Observer<Message>) => {
      this.hubConnection.on('ReceiveMessage', (data: any) => {
        observer.next(data);
      });
    });
  }

  adminReceiveSeenMessage() {
    return new Observable<Message>((observer: Observer<Message>) => {
      this.hubConnection.on('ReceiveSeenMessage', (data: Message) => {
        observer.next(data);
      });
    });
  }

  adminReceiveAlertTyping() {
    return new Observable<Message>((observer: Observer<Message>) => {
      this.hubConnection.on('ReceiveAlertTyping', (data: Message) => {
        observer.next(data);
      });
    });
  }

  clientReceiveMessage() {
    return new Observable<Message>((observer: Observer<Message>) => {
      this.hubConnection.on('ReceiveMessage', (data: Message) => {
        observer.next(data);
      });
    });
  }

  clientReceiveSeenMessage() {
    return new Observable<Message>((observer: Observer<Message>) => {
      this.hubConnection.on('ReceiveSeenMessage', (data: Message) => {
        observer.next(data);
      });
    });
  }

  clientReceiveAlertTyping() {
    return new Observable<Message>((observer: Observer<Message>) => {
      this.hubConnection.on('ReceiveAlertTyping', (data: Message) => {
        observer.next(data);
      });
    });
  }
}
