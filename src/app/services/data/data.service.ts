import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';


/*
This service handles all data manipulation between components
see below for function definitions.
*/

@Injectable({
  providedIn: 'root'
})
export class DataService {
  public Groups: any[];
  public Channels: any[];
  public Users: any[];
  public selectedGroup = 0;
  public selectedChannel = 0;
  public currentUser;

  // Change URL depending on which environment is being used
  public url = 'http://localhost:8080'; // Local
//  public url = 'https://node-garbage-thomasmcdonald1996.c9users.io'; // Cloud9
 // public url = 'https://chat-factory.herokuapp.com'; // "Production"

  constructor() {
   }

// Observable to get user content.
  getCurrentUser(): Observable<any[]> {
    return of(this.currentUser = JSON.parse(localStorage.getItem('UserDetails')));
  }

// Removes the local storage of the user, when they log out
  removeCurrentUserStorage(){
    localStorage.removeItem('UserDetails');
  }
}
