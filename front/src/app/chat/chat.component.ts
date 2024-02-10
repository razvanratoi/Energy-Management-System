import {Component, OnInit} from '@angular/core';
import {UserService} from "../_services/user.service";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  isAdmin: boolean = false;

  constructor(private userService: UserService) {
  }

  ngOnInit() {
    this.userService.getRole().subscribe(user => {
      sessionStorage.setItem('name', user.name);
      if (user.role === 'Admin') {
        this.isAdmin = true;
      }
    });
  }
}
