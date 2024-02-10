import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {MONITORING, MONITORING_PATH} from "../app.constants";
import {Monitoring} from "../_models/Monitoring";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MonitoringService {

  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };

  constructor(private http: HttpClient) {
  }

  getMonitoringByDay(day: Date) {
    return this.http.post(`${MONITORING_PATH}/${MONITORING}/`, day.toString(), this.httpOptions);
  }

  getAll(): Observable<Monitoring[]> {
    return this.http.get<Monitoring[]>(`${MONITORING_PATH}/${MONITORING}/all`);
  }
}
