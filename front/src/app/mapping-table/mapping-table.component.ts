import {Component, OnInit} from '@angular/core';
import {BASIC_GUID, displayedColumnsObject} from "../app.constants";
import {MatTableDataSource} from "@angular/material/table";
import {DeviceService} from "../_services/device.service";
import {UserService} from "../_services/user.service";
import {DisplayedMapping} from "../_models/displayedMapping";
import {Device} from "../_models/device";
import {User} from "../_models/user";
import {Mapping} from "../_models/mapping";
import {CommonService} from "../_services/common.service";

@Component({
  selector: 'app-mapping-table',
  templateUrl: './mapping-table.component.html',
  styleUrls: ['./mapping-table.component.css']
})
export class MappingTableComponent implements OnInit {

  dataSource: MatTableDataSource<DisplayedMapping> = new MatTableDataSource<DisplayedMapping>([]);
  displayedColumns = displayedColumnsObject.mapping;
  users: User[] = [];
  devices: Device[] = [];
  mappings: DisplayedMapping[] = [];

  constructor(private userService: UserService, private deviceService: DeviceService, private commonService: CommonService) {

  }

  ngOnInit() {
    this.userService.getAllUsers().subscribe({
      next: users => {
        this.users = users;

        this.deviceService.getAllDevices().subscribe({
          next: devices => {
            this.devices = devices;

            this.deviceService.getAllMappings().subscribe({
              next: mappings => {
                this.mappings = mappings.map(mapping => {
                  const device = this.devices.find(device => device.id === mapping.deviceId)!;
                  const user = this.users.find(user => user.id === mapping.userId)!;
                  return {
                    id: mapping.id,
                    deviceName: device.name,
                    clientName: user.name,
                  }
                });
                this.dataSource.data = this.mappings;
              },
              error: err => {
                this.commonService.openSnackBar(err.error);
                console.log(err);
              }
            });
          },
          error: err => {
            this.commonService.openSnackBar(err.error);
            console.log(err);
          }
        });
      },
      error: err => {
        this.commonService.openSnackBar(err.error);
        console.log(err);
      }
    });


  }

  addMapping(result: Mapping) {
    result.id = BASIC_GUID;
    console.log(result);
    this.deviceService.createMapping(result).subscribe({
      next: (mapping) => {
        this.mappings.push({
          id: mapping.id,
          deviceName: this.devices.find(device => device.id === mapping.deviceId)!.name,
          clientName: this.users.find(user => user.id === mapping.userId)!.name,
        });
        this.dataSource.data = this.mappings;
      },
      error: (err: any) => {
        this.commonService.openSnackBar('Could not add user-device mapping!');
        console.log(err);
      }
    });
  }
}
