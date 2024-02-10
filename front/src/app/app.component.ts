import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'ds';
  onChat: boolean = false;

  constructor(private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.router.events.subscribe((val) => {
      this.onChat = this.router.url === '/chat' || this.router.url === '/';
      // const token = sessionStorage.getItem('token');
      // if (!token) {
      //   this.router.navigate(['']);
      // }
    });
  }

  goToChats() {
    this.router.navigate(['/chat']);
  }
}
