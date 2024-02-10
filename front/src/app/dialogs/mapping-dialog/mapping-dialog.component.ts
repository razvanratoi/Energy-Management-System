import {Component, Inject, OnInit} from '@angular/core';
import {Mapping} from "../../_models/mapping";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {UserService} from "../../_services/user.service";
import {Device} from "../../_models/device";
import {User} from "../../_models/user";
import {DeviceService} from "../../_services/device.service";

@Component({
  selector: 'app-mapping-dialog',
  templateUrl: './mapping-dialog.component.html',
  styleUrls: ['./mapping-dialog.component.css']
})
export class MappingDialogComponent implements OnInit {

  mapping: Mapping = {
    id: '',
    deviceId: '',
    userId: '',
  };
  users: User[] = [];
  devices: Device[] = [];

  constructor(private userService: UserService, private deviceService: DeviceService, private dialogRef: MatDialogRef<MappingDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    if (data) {
      this.mapping = {...data};
    }
  }

  ngOnInit(): void {
    this.userService.getAllUsers().subscribe({
      next: users => {
        this.users = users;
      },
      error: err => {
        console.log(err);
      }
    });

    this.deviceService.getAllDevices().subscribe({
      next: devices => {
        this.devices = devices;
      },
      error: err => {
        console.log(err);
      }
    });
  }

  onCancel() {
    this.dialogRef.close();
  }

  onCreate() {
    this.dialogRef.close(this.mapping);
  }
}
