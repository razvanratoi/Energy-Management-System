import {Component, OnInit} from '@angular/core';
import {UserService} from "../_services/user.service";
import {Router} from "@angular/router";
import {CommonService} from "../_services/common.service";

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent implements OnInit {

  inputType = 'password';
  credentials: { username: string, password: string } = {username: '', password: ''};

  constructor(private userService: UserService, private router: Router, private commonService: CommonService) {
  }

  ngOnInit() {
    if (sessionStorage.getItem('token') !== null) {

      this.userService.getRole().subscribe(response => {
        if (response.role === 'Admin') {
          this.router.navigate(['dashboard/clients']);
        } else {
          this.router.navigate(['dashboard/devices']);
        }
      });
    }
  }

  switchInputType() {
    this.inputType = this.inputType === 'password' ? 'text' : 'password';
  }

  login() {
    this.userService.login(this.credentials.username.trim(), this.credentials.password.trim())
      .subscribe({
        next: (token: { username: string, password: string }) => {
          console.log(token);
          sessionStorage.setItem('token', token.username);
          let route = 'dashboard/';
          if (token.password === 'Admin') {
            this.router.navigate([`${route}/clients`]);
          } else {
            this.router.navigate([`${route}/devices`]);
          }
        },
        error: (err: any) => {
          this.commonService.openSnackBar('Invalid credentials');
        }
      });
  }
}
