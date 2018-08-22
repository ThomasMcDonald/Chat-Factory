import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  public Groups: any[];
  public Channels: any[];
  public Users: any[];
  public currentUser;
  constructor() {
   }


  getUsers(){
    return this.Users;
  }
  getCurrentUser(): Observable<any[]> {
    return of(this.currentUser = JSON.parse(localStorage.getItem('UserDetails')));
  }

}
