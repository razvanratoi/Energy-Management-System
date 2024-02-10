// chart.component.ts
import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import bb, {ChartOptions, Data, line} from 'billboard.js';
import {Monitoring} from "../_models/Monitoring";
import {Device} from "../_models/device";

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css'],
})
export class ChartComponent implements OnChanges {
  @Input() deviceIds: string[] = [];
  @Input() monitorings: Monitoring[] = [];

  @Input() devices: Device[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.devices);
    if (changes['monitorings'] || changes['deviceIds']) {
      console.log(this.deviceIds, this.monitorings);
      console.log(this.monitorings
        .filter((item) => item.deviceId === this.deviceIds[0])
        .map((item) => item.consumption))
      this.generateChart();
    }
  }

  private generateChart(): void {
    const columns = [
      ['x'].concat(this.monitorings.map((item) => item.timestamp.toString())),
      ...this.deviceIds.map((deviceId) => [
        this.getDeviceName(deviceId), // Use a helper function to get the device name
        ...this.monitorings
          .filter((item) => item.deviceId === deviceId)
          .map((item) => item.consumption),
      ]),
    ];

    const data: Data = {x: 'x', columns, type: line()};

    const options: ChartOptions = {
      axis: {
        x: {type: 'timeseries', tick: {format: '%H:%M:%S'}},
        y: {label: 'Consumption [kWh]'},
      },
      bindto: '#chartId',
    };

    bb.generate({...options, data});
  }

// Helper function to get the device name based on the device ID
  private getDeviceName(deviceId: string): string {
    const device = this.devices.find((device) => device.id === deviceId);
    return device ? device.name : '';
  }

}
