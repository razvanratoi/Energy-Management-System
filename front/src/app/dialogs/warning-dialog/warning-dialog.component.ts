import {Component, Inject, OnInit} from '@angular/core';
import {Device} from "../../_models/device";
import {DeviceService} from "../../_services/device.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-warning-dialog',
  templateUrl: './warning-dialog.component.html',
  styleUrls: ['./warning-dialog.component.css']
})
export class WarningDialogComponent implements OnInit {

  constructor(private deviceService: DeviceService,
              public dialogRef: MatDialogRef<WarningDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: Device,) {
  }

  ngOnInit() {
    console.log(this.data);
  }
}
