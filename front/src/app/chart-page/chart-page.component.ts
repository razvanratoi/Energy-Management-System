// chart-page.component.ts
import {Component, OnInit} from '@angular/core';
import {MonitoringService} from '../_services/monitoring.service';
import {Monitoring} from '../_models/Monitoring';
import {Router} from '@angular/router';
import {DeviceService} from '../_services/device.service';
import {UserService} from "../_services/user.service";
import {Device} from "../_models/device";
import {User} from "../_models/user";
import {MatCalendarCellClassFunction} from "@angular/material/datepicker";

@Component({
  selector: 'app-chart-page',
  templateUrl: './chart-page.component.html',
  styleUrls: ['./chart-page.component.css'],
})
export class ChartPageComponent implements OnInit {
  monitorings: Monitoring[] = [];
  displayedMonitorings: Monitoring[] = [];
  selectedDate: Date = new Date();
  deviceIds: string[] = [];
  devices: Device[] = [];

  constructor(
    private monitoringService: MonitoringService,
    private router: Router,
    private deviceService: DeviceService,
    private userService: UserService
  ) {
  }

  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    const isHighlighted = this.monitorings.filter((monitoring) => {
      const monitoringDate = monitoring.timestamp;
      return (
        cellDate.getDate() === monitoringDate.getDate() &&
        cellDate.getMonth() === monitoringDate.getMonth() &&
        cellDate.getFullYear() === monitoringDate.getFullYear()
      );
    }).length > 0 && cellDate.getDate() != this.selectedDate.getDate();

    console.log(cellDate, isHighlighted);
    return isHighlighted ? 'highlighted-day' : '';
  };

  ngOnInit(): void {
    let userId = '';
    this.userService.getRole().subscribe({
      next: (response: User) => {
        if (response.role === 'Admin') {
          this.router.navigate(['/dashboard/users']);
        }

        userId = response.id;

        this.deviceService.getDevicesByUserId(userId).subscribe({
          next: (devices: Device[]) => {
            this.devices = devices;
            console.log(devices)

            this.monitoringService.getAll().subscribe({
              next: (monitorings: any[]) => {
                const devicesIds = this.devices.map((device) => device.id);
                this.monitorings = monitorings.filter(monitoring => devicesIds.includes(monitoring.deviceId)).map((monitoring) => ({
                  id: monitoring.id,
                  deviceId: monitoring.deviceId,
                  consumption: monitoring.consumption,
                  timestamp: new Date(monitoring.timestamp),
                }));

                this.onDateSelected(this.selectedDate);

                this.deviceIds = [...new Set(monitorings.map((item) => item.deviceId))];
                this.monitorings.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
              },
              error: (err: any) => {
                console.log(err);
              },
            });
          }
        });
      },
      error(err: any): void {
        console.error(err);
      }
    });


  }

  goBack() {
    this.router.navigate(['/dashboard/devices']);
  }

  onDateSelected(event: any) {
    this.displayedMonitorings = this.monitorings.filter((monitoring) => {
      return (
        monitoring.timestamp.getDay() == new Date(this.selectedDate).getDay() &&
        monitoring.timestamp.getMonth() == new Date(this.selectedDate).getMonth() &&
        monitoring.timestamp.getFullYear() == new Date(this.selectedDate).getFullYear()
      );
    });
  }
}
