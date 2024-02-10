import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {USER, USER_PATH} from "../app.constants";
import {FullUser} from "../_models/fullUser";
import {User} from "../_models/user";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };

  constructor(private http: HttpClient) {
  }

  login(username: string, password: string) {
    return this.http.post<{ username: string, password: string }>(`${USER_PATH}/${USER}/login`, {
      username,
      password
    }, this.httpOptions);
  }

  getRole() {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<User>(`${USER_PATH}/${USER}/fromToken`, {headers});
  }

  getAllUsers() {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<{
      id: string,
      name: string,
      address: string,
      role: string
    }[]>(`${USER_PATH}/${USER}`, {headers});
  }

  addUser(user: FullUser) {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<FullUser>(`${USER_PATH}/${USER}`, user, {headers});
  }

  updateUser(user: FullUser) {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.put<FullUser>(`${USER_PATH}/${USER}`, user, {headers});
  }

  deleteUser(id: string) {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete<any>(`${USER_PATH}/${USER}/${id}`, {headers});
  }

  getUser(id: string) {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<FullUser>(`${USER_PATH}/${USER}/${id}`, {headers});
  }

  getId() {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<string>(`${USER_PATH}/${USER}/idFromToken`, {headers});
  }
}
