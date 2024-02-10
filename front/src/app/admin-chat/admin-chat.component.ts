import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Message} from "../_models/message";
import {Router} from "@angular/router";
import {ChatService} from "../_services/chat.service";

@Component({
  selector: 'app-admin-chat',
  templateUrl: './admin-chat.component.html',
  styleUrls: ['./admin-chat.component.css']
})
export class AdminChatComponent implements OnInit {

  @ViewChild('messagesContainer') chat!: ElementRef;

  messages: Message[] = [];
  messageStatus: string[] = [];
  message: string = '';
  clients: { name: string, status: string }[] = [];
  shownMessages: Message[] = [];
  currentClient: { name: string, status: string } = {name: 'Select a client...', status: ''};

  constructor(private router: Router, private chatService: ChatService) {
  }

  ngOnInit() {
    this.getWS();
    this.messages = sessionStorage.getItem('messages') ? JSON.parse(sessionStorage.getItem('messages')!) : [];
    const clientNames = this.messages.map(message => message.sender);
    clientNames.forEach(name => {
      if (!this.clients.find(client => client.name === name) && name !== 'Admin') {
        this.clients.push({name: name, status: ''});
      }
    });
  }

  goToDashboard() {
    this.router.navigate(['/dashboard/devices']);
  }

  sendMessage() {
    if (this.message.length > 0) {
      const message = {
        sender: 'Admin',
        receiver: this.currentClient.name,
        content: this.message,
        timestamp: new Date().toLocaleTimeString()
      };
      this.messages.push(message);
      this.shownMessages.push(message);
      this.chatService.sendMessage(message);
      this.message = '';
      this.messageStatus.push('sent');
      sessionStorage.setItem('messages', JSON.stringify(this.messages));
      sessionStorage.setItem('status', JSON.stringify(this.messageStatus));
    }

    setTimeout(() => {
      this.scrollToBottom();
    }, 1000);
  }

  openChat(client: { name: string, status: string }) {
    this.currentClient = client;
    this.shownMessages = this.messages.filter(message => message.sender === client.name || message.receiver === client.name);
    for (let i = 0; i < this.shownMessages.length; i++) {
      const messageIndex = this.messages.indexOf(this.shownMessages[i]);
      this.messageStatus[messageIndex] = 'read';
    }
    const seenMessage: Message = {
      sender: 'Admin',
      receiver: this.currentClient.name,
      content: '',
      timestamp: ''
    };
    this.chatService.seenMessage(seenMessage);

    setTimeout(() => {
      this.scrollToBottom();
    }, 1000);
  }

  scrollToBottom(): void {
    this.chat.nativeElement.scrollTop = this.chat.nativeElement.scrollHeight;
  }

  getWS() {
    this.chatService.startConnection();

    this.chatService.adminReceiveMessage().subscribe((message: any) => {
      if (message.receiver !== 'Admin' || message.sender === 'Admin')
        return;

      if (this.clients.map(client => client.name).indexOf(message.sender) === -1)
        this.clients.push({name: message.sender, status: ''});

      this.messages.push(message);
      this.messageStatus.push('sent');

      if (this.currentClient.name === message.sender) {
        this.shownMessages.push(message);
        const index = this.messages.indexOf(message);
        this.messageStatus.splice(index, 1, 'read');
        this.chatService.seenMessage({
          sender: 'Admin',
          receiver: this.currentClient.name,
          content: '',
          timestamp: ''
        })
      }
      sessionStorage.setItem('messages', JSON.stringify(this.messages));
      sessionStorage.setItem('status', JSON.stringify(this.messageStatus));
      this.scrollToBottom();
    });

    this.chatService.adminReceiveAlertTyping().subscribe((message: Message) => {
      console.log(message);
      if (message.receiver !== 'Admin' || message.sender !== this.currentClient.name)
        return;

      this.currentClient.status = ' is typing...';
      setTimeout(() => {
        this.currentClient.status = '';
      }, 500);
    });

    this.chatService.adminReceiveSeenMessage().subscribe((message: Message) => {
      console.log(message);
      if (message.receiver !== 'Admin')
        return;

      const filteredMessages = this.messages.filter((m: Message) => m.receiver === message.sender);

      for (let mess of filteredMessages) {
        const index = this.messages.indexOf(mess);
        console.log(mess, index);
        this.messageStatus.splice(index, 1, 'read');
      }

      sessionStorage.setItem('status', JSON.stringify(this.messageStatus));
    });
  }

  setTyping() {
    const message: Message = {
      sender: 'Admin',
      receiver: this.currentClient.name,
      content: '',
      timestamp: new Date().toString()
    };
    this.chatService.alertTyping(message);
  }
}
