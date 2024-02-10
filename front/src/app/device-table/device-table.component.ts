import {Component, Input, OnInit} from '@angular/core';
import {Device} from "../_models/device";
import {BASIC_GUID, DIALOG_CONFIG, displayedColumnsObject} from "../app.constants";
import {MatTableDataSource} from "@angular/material/table";
import {MatDialog} from "@angular/material/dialog";
import {DeviceService} from "../_services/device.service";
import {DeviceDialogComponent} from "../dialogs/device-dialog/device-dialog.component";
import {ConfirmDialogComponent} from "../dialogs/confirm-dialog/confirm-dialog.component";
import {CommonService} from "../_services/common.service";
import {UserService} from "../_services/user.service";
import {WebSocketService} from "../_services/web-socket.service";
import {WarningDialogComponent} from "../dialogs/warning-dialog/warning-dialog.component";

@Component({
  selector: 'app-device-table',
  templateUrl: './device-table.component.html',
  styleUrls: ['./device-table.component.css']
})
export class DeviceTableComponent implements OnInit {

  @Input() isAdmin!: boolean;
  devices: Device[] = [];
  dataSource = new MatTableDataSource<Device>([]);
  displayedColumns = displayedColumnsObject.device;

  constructor(private deviceService: DeviceService,
              public dialog: MatDialog,
              private commonService: CommonService,
              private userService: UserService,
              private wsService: WebSocketService) {
  }

  ngOnInit() {
    if (this.isAdmin) {
      this.deviceService.getAllDevices().subscribe({
        next: devices => {
          this.devices = devices;
          this.dataSource.data = this.devices;
          console.log(devices);

          this.openWarningDialog("device_id 1");
        },
        error: err => {
          this.commonService.openSnackBar(err.error);
          console.log(err);

        }
      });
    } else {
      this.userService.getId().subscribe({
        next: id => {
          console.log(id);
          this.deviceService.getDevicesByUserId(id).subscribe({
            next: devices => {
              this.devices = devices;
              this.dataSource.data = this.devices;


              this.wsService.startConnection();
              this.wsService.onNotifyFrontend().subscribe((data: string) => {
                if (this.devices.find((d: Device) => d.name === data) !== undefined) {
                  this.openWarningDialog(data)
                }
              });
            },
            error: err => {
              this.commonService.openSnackBar('Error getting devices');
              console.log(err);
            }
          });
        },
        error: err => {
          this.commonService.openSnackBar("Error getting user id");
          console.log(err);
        }
      })
    }

  }


  addDevice(device: Device) {
    device.id = BASIC_GUID;
    this.deviceService.createDevice(device).subscribe({
      next: (device) => {
        this.devices.push(device);
        this.dataSource.data = this.devices;
      },
      error: (err: any) => {
        this.commonService.openSnackBar("Could not add device!");
        console.log(err);
      }
    });
  }

  editDevice(device: Device) {
    const dialogRef = this.dialog.open(DeviceDialogComponent, {...DIALOG_CONFIG, data: device});
    const subscriber = dialogRef.afterClosed().subscribe((result: Device) => {
      subscriber.unsubscribe();
      if (result) {
        this.deviceService.updateDevice(result).subscribe({
          next: (response) => {
            const outdatedDevice = this.devices.find(d => d.id === device.id);
            this.devices.splice(this.devices.indexOf(outdatedDevice!), 1, result);
            this.dataSource.data = this.devices;
          },
          error: (err: any) => {
            this.commonService.openSnackBar("Could not update device!");
            console.log(err);
          }
        });
      }
    });
  }

  deleteDevice(device: Device) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {...DIALOG_CONFIG, data: device.name});
    const subscriber = dialogRef.afterClosed().subscribe((result: boolean) => {
      subscriber.unsubscribe();
      if (!result) {
        return;
      }
      this.deviceService.deleteDevice(device.id).subscribe({
        next: (response) => {
          this.devices.splice(this.devices.indexOf(device), 1);
          this.dataSource.data = this.devices;
        },
        error: (err: any) => {
          this.devices.push(device);
          this.commonService.openSnackBar("Could not delete device!");
          console.log(err);
        }
      });
    });
  }

  openWarningDialog(data: string) {

    const deviceId = data.substring(data.lastIndexOf(' ') + 1);
    const device = this.devices.find(d => d.id === deviceId);
    if (device === undefined) {
      return;
    }

    this.dialog.open(WarningDialogComponent,
      {...DIALOG_CONFIG, data: device}
    );
  }
}
