import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Device} from "../_models/device";
import {Mapping} from "../_models/mapping";
import {DEVICE, DEVICE_PATH, MAPPING} from "../app.constants";

@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  constructor(private http: HttpClient) {
  }

  getAllDevices() {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<Device[]>(`${DEVICE_PATH}/${DEVICE}`, {headers});
  }

  getAllMappings() {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<Mapping[]>(`${DEVICE_PATH}/${MAPPING}`, {headers});
  }

  createDevice(device: Device) {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<Device>(`${DEVICE_PATH}/${DEVICE}`, device, {headers});
  }

  updateDevice(device: Device) {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.put<Device>(`${DEVICE_PATH}/${DEVICE}`, device, {headers});
  }

  deleteDevice(deviceId: string) {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete(`${DEVICE_PATH}/${DEVICE}/${deviceId}`, {headers});
  }

  getDevicesByUserId(userId: string) {
    
    return this.http.get<Device[]>(`${DEVICE_PATH}/${DEVICE}/byUser/${userId}`);
  }

  createMapping(mapping: Mapping) {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<Mapping>(`${DEVICE_PATH}/${MAPPING}`, mapping, {headers});
  }
}
