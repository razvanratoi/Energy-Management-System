import {Component, Inject} from '@angular/core';
import {Device} from "../../_models/device";
import {UserService} from "../../_services/user.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-device-dialog',
  templateUrl: './device-dialog.component.html',
  styleUrls: ['./device-dialog.component.css']
})
export class DeviceDialogComponent {
  device: Device = {
    id: '',
    name: '',
    description: '',
    address: '',
    maxHourlyConsumption: 0,
  };

  constructor(private userService: UserService, private dialogRef: MatDialogRef<DeviceDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    if (data) {
      this.device = {...data};
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  onCreate() {
    this.dialogRef.close(this.device);
  }
}
