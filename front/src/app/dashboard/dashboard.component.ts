import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {UserDialogComponent} from "../dialogs/user-dialog/user-dialog.component";
import {DIALOG_CONFIG} from "../app.constants";
import {FullUser} from "../_models/fullUser";
import {DeviceDialogComponent} from "../dialogs/device-dialog/device-dialog.component";
import {Device} from "../_models/device";
import {ClientTableComponent} from "../client-table/client-table.component";
import {MappingTableComponent} from "../mapping-table/mapping-table.component";
import {DeviceTableComponent} from "../device-table/device-table.component";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../_services/user.service";
import {MappingDialogComponent} from "../dialogs/mapping-dialog/mapping-dialog.component";
import {Mapping} from "../_models/mapping";
import {CommonService} from "../_services/common.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  @ViewChild('clientsTable') clientTable!: ClientTableComponent;
  @ViewChild('devicesTable') deviceTable!: DeviceTableComponent;
  @ViewChild('mappingsTable') mappingTable!: MappingTableComponent;
  tableTitle: string = "Users";
  button1: string = "See Devices";
  button2: string = "See Mappings";
  isAdmin!: boolean;

  constructor(private userService: UserService,
              private route: ActivatedRoute,
              public dialog: MatDialog,
              private router: Router,
              private commonService: CommonService) {
  }

  ngOnInit() {

    this.userService.getRole().subscribe({
      next: response => {
        this.isAdmin = response.role === 'Admin';
        const type = this.route.snapshot.paramMap.get('type');

        if (!this.isAdmin && type !== 'devices') {
          window.location.href = '/denied';
        }

        switch (type) {
          case 'clients':
            this.seeUsers();
            break;
          case 'devices':
            this.seeDevices();
            break;
          case 'mappings':
            this.seeMappings();
            break;
          default:
            this.seeDevices();
            break;
        }
      },
      error: err => {
        this.commonService.openSnackBar("Could not identify user!");
      }
    });
  }

  seeDevices() {
    this.tableTitle = "Devices";
    this.button1 = "See Users";
    this.button2 = "See Mappings";
    this.router.navigate(['dashboard/devices']);
  }

  seeMappings() {
    this.tableTitle = "Users-Device Mappings";
    this.button1 = "See Users";
    this.button2 = "See Devices";
    this.router.navigate(['dashboard/mappings']);
  }

  seeUsers() {
    this.tableTitle = "Users";
    this.button1 = "See Devices";
    this.button2 = "See Mappings";
    this.router.navigate(['dashboard/clients']);
  }

  addUser() {
    const dialogRef = this.dialog.open(UserDialogComponent, {...DIALOG_CONFIG, data: undefined});
    const subscriber = dialogRef.afterClosed().subscribe((result: FullUser) => {
      subscriber.unsubscribe();
      if (result) {
        this.clientTable.addUser(result);
      }
    });
  }

  addDevice() {
    const dialogRef = this.dialog.open(DeviceDialogComponent, {...DIALOG_CONFIG, data: undefined});
    const subscriber = dialogRef.afterClosed().subscribe((result: Device) => {
      subscriber.unsubscribe();
      if (result) {
        this.deviceTable.addDevice(result);
      }
    });
  }

  addMapping() {
    const dialogRef = this.dialog.open(MappingDialogComponent, {...DIALOG_CONFIG, data: undefined});
    const subscriber = dialogRef.afterClosed().subscribe((result: Mapping) => {
      subscriber.unsubscribe();
      if (result) {
        this.mappingTable.addMapping(result);
      }
    });
  }

  logOut() {
    sessionStorage.removeItem('token');
    this.router.navigate(['']);
  }

  goToChart() {
    this.router.navigate(['chart']);
  }
}
