import {Component} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-access-denied-page',
  templateUrl: './access-denied-page.component.html',
  styleUrls: ['./access-denied-page.component.css']
})
export class AccessDeniedPageComponent {

  constructor(private router: Router) {

  }

  redirect() {
    if (sessionStorage.getItem('token') !== null) {
      this.router.navigate(['dashboard/devices']);
    } else {
      this.router.navigate(['']);
    }
  }
}
