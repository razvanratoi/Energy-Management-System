import {Component, OnInit} from '@angular/core';
import {User} from "../_models/user";
import {UserDialogComponent} from "../dialogs/user-dialog/user-dialog.component";
import {BASIC_GUID, DIALOG_CONFIG, displayedColumnsObject} from "../app.constants";
import {FullUser} from "../_models/fullUser";
import {ConfirmDialogComponent} from "../dialogs/confirm-dialog/confirm-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {UserService} from "../_services/user.service";
import {MatTableDataSource} from "@angular/material/table";
import {CommonService} from "../_services/common.service";

@Component({
  selector: 'app-client-table',
  templateUrl: './client-table.component.html',
  styleUrls: ['./client-table.component.css']
})
export class ClientTableComponent implements OnInit {


  users: User[] = [];
  dataSource = new MatTableDataSource<User>([]);
  displayedColumns = displayedColumnsObject.user

  constructor(private userService: UserService, public dialog: MatDialog, private commonService: CommonService) {

  }

  ngOnInit() {
    this.userService.getRole().subscribe(role => {
        if (role.role === 'Admin') {
          this.userService.getAllUsers().subscribe({
            next: users => {
              this.users = users;
              this.dataSource.data = users;
            },
            error: err => {
              this.commonService.openSnackBar("Could not get users!");
            }
          });
        }
      }
    );
  }

  addUser(user: FullUser) {
    user.id = BASIC_GUID;
    this.userService.addUser(user).subscribe({
      next: (user: FullUser) => {
        console.log(user);
        this.users.push(user);
        this.dataSource.data = this.users;
      },
      error: (err: any) => {
        this.commonService.openSnackBar('Could not add user!');
      }
    });
  }

  editUser(user: User) {
    const dialogRef = this.dialog.open(UserDialogComponent, {...DIALOG_CONFIG, data: user});
    const subscriber = dialogRef.afterClosed().subscribe((result: FullUser) => {
      subscriber.unsubscribe();

      if (!result) {
        return;
      }
      this.userService.updateUser(result).subscribe({
        next: (user: FullUser) => {
          const userToFind: User = this.users.find(u => u.id === result.id)!;
          this.users.splice(this.users.indexOf(userToFind), 1, result);
          this.dataSource.data = this.users;
        },
        error: (err: any) => {
          this.commonService.openSnackBar('Could not edit user!');
        }
      });
    });
  }

  deleteUser(user: User) {
    this.users.splice(this.users.indexOf(user), 1);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {...DIALOG_CONFIG, data: user.name});
    const subscriber = dialogRef.afterClosed().subscribe((result: boolean) => {
      subscriber.unsubscribe();
      if (!result) {
        return;
      }
      this.userService.deleteUser(user.id).subscribe({
        next: (user: User) => {
          this.dataSource.data = this.users;
        },
        error: (err: any) => {
          this.users.push(user);
          this.commonService.openSnackBar('Could not delete user!');
        }
      });
    });
  }
}
