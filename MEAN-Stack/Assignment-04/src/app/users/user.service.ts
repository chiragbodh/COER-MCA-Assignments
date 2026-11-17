import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
export interface User {id:number;name:string;email:string;}
@Injectable({providedIn:'root'})
export class UserService {
  private http=inject(HttpClient);
  // Configure a same-origin deployment here. In development proxy.conf.json forwards /api to port 4300.
  private endpoint='/api/users';
  getUsers(){return this.http.get<User[]>(this.endpoint);}
  addUser(user:Omit<User,'id'>){return this.http.post<User>(this.endpoint,user);}
}
