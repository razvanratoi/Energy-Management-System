import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Message} from "../_models/message";
import {Router} from "@angular/router";
import {ChatService} from "../_services/chat.service";
import {UserService} from "../_services/user.service";

@Component({
  selector: 'app-client-chat',
  templateUrl: './client-chat.component.html',
  styleUrls: ['./client-chat.component.css']
})
export class ClientChatComponent implements OnInit, AfterViewInit {

  @ViewChild('messagesContainer') chat!: ElementRef;

  status: string = '';
  message: string = '';
  messages: Message[] = [];
  messageStatus: string[] = [];
  name: string = '';

  constructor(private router: Router, private chatService: ChatService, private userService: UserService) {
  }

  ngOnInit(): void {
    this.userService.getRole().subscribe(user => {
      this.name = user.name;
    });

    const messages = sessionStorage.getItem('messages');
    if (messages) {
      this.messages = JSON.parse(messages);
    }
    const status = sessionStorage.getItem('status');
    if (status) {
      this.messageStatus = JSON.parse(status);
    }

    this.getWS();

    const message: Message = {
      sender: this.name,
      receiver: 'Admin',
      content: '',
      timestamp: new Date().toString()
    };

    this.chatService.seenMessage(message);
  }

  ngAfterViewInit(): void {
    this.scrollToBottom();
  }

  sendMessage() {
    if (this.message.length > 0) {
      const message = ({
        sender: this.name,
        receiver: 'Admin',
        content: this.message,
        timestamp: new Date().toLocaleTimeString()
      });
      this.chatService.sendMessage(message);
      this.messages.push(message);
      this.message = '';
      this.messageStatus.push('sent');
      sessionStorage.setItem('messages', JSON.stringify(this.messages));
      sessionStorage.setItem('status', JSON.stringify(this.messageStatus));
    }
    this.scrollToBottom();
  }

  goToDashboard() {
    this.router.navigate(['/dashboard/devices']);
  }

  scrollToBottom(): void {
    this.chat.nativeElement.scrollTop = this.chat.nativeElement.scrollHeight;
  }

  getWS() {
    this.chatService.startConnection();

    this.chatService.clientReceiveMessage().subscribe((message: Message) => {

      if (message.receiver !== this.name)
        return;

      this.messages.push(message);
      this.messageStatus.push('read');
      sessionStorage.setItem('messages', JSON.stringify(this.messages));
      sessionStorage.setItem('status', JSON.stringify(this.messageStatus));
      setTimeout(() => {
        this.scrollToBottom();
      }, 200)

    });

    this.chatService.clientReceiveAlertTyping().subscribe((message: Message) => {
      console.log(message)
      if (message.receiver !== this.name)
        return;

      this.status = 'is typing...';
      setTimeout(() => {
        this.status = '';
      }, 500);
    });

    this.chatService.clientReceiveSeenMessage().subscribe((message: Message) => {
      if (message.receiver !== this.name)
        return;

      for (let mess of this.messages) {
        const index = this.messages.indexOf(mess);
        this.messageStatus.splice(index, 1, 'read');
      }

      sessionStorage.setItem('status', JSON.stringify(this.messageStatus));
    });
  }

  setTyping() {
    const message: Message = {
      sender: this.name,
      receiver: 'Admin',
      content: '',
      timestamp: new Date().toString()
    };
    this.chatService.alertTyping(message);
  }

  seenWrapper() {
    console.log('seen');
    const message: Message = {
      sender: this.name,
      receiver: 'Admin',
      content: '',
      timestamp: new Date().toString()
    };
    this.chatService.seenMessage(message);
  }
}
