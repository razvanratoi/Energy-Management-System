import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FullUser} from "../../_models/fullUser";
import {UserService} from "../../_services/user.service";

@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.css']
})
export class UserDialogComponent implements OnInit {

  user: FullUser = {
    id: 'some-guid',
    name: '',
    address: '',
    role: '',
    username: '',
    password: '',
    salt: ''
  };
  roles: string[] = ["Admin", "Client"];

  constructor(private userService: UserService, private dialogRef: MatDialogRef<UserDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
    if (!this.data) {
      return;
    }

    this.userService.getUser(this.data.id).subscribe({
      next: (result: FullUser) => {
        this.user = result;
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  onCancel() {
    this.dialogRef.close();
  }

  onCreate() {
    this.dialogRef.close(this.user);
  }
}
