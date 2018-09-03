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

  // Change URL depending on which environment is being used
 // public url = 'http://localhost:8080'; // Local
   public url = 'https://node-garbage-thomasmcdonald1996.c9users.io'; // Cloud9
 // public url = 'https://chat-factory.herokuapp.com'; // "Production"

  constructor() {
   }

  getCurrentUser(): Observable<any[]> {
    return of(this.currentUser = JSON.parse(localStorage.getItem('UserDetails')));
  }

  removeCurrentUserStorage(){
    localStorage.removeItem('userDetails');
  }
}
