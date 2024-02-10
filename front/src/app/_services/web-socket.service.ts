import {Injectable} from '@angular/core';
import {HttpTransportType, HubConnection, HubConnectionBuilder} from "@microsoft/signalr";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  hubConnection!: HubConnection;

  constructor() {
  }

  startConnection() {
    this.hubConnection = new HubConnectionBuilder().withUrl('http://localhost:8089/notificationHub', {
      skipNegotiation: true,
      transport: HttpTransportType.WebSockets
    }).build();

    this.hubConnection.start().then(() => {
      console.log('Connection started');
    }).catch(err => {
      console.log('Error while starting connection: ' + err);
    });
  }

  onNotifyFrontend() {
    return new Observable<string>(observer => {
      this.hubConnection.on('notifyfrontend', (data: string) => {
        observer.next(data);
      });
    });
  }
}
