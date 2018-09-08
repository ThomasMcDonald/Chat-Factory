import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Observer } from 'rxjs/Observer';

import { DataService } from '../data/data.service'
import { HttpClient } from '@angular/common/http';
import io from "socket.io-client";

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private socket;
  observer: Observer<any>;
  public userDetails;
  public Groups = [];
  public Channels = [];
  public Users = [];

  get url():String {
    return this.dataService.url;
  }


  constructor(private http: HttpClient, private dataService: DataService) {
    this.getCurrentUser();



}

  // Connect Socket
  public initSocket(){
    this.socket = io.connect(this.url);

    this.socket.on('newData', (res) => {
      this.socket.emit("requestData",this.userDetails._id);
    });

    this.loginSetup();
  }

  public loginSetup(){
    this.socket.emit("loginSetup",this.userDetails._id);
  }


  updateData(): Observable<any> {
   this.socket.on('updatedData', (res) => {
     console.log(res);
     this.observer.next(res);
   });

   return this.createObservable();
 }


 createObservable() : Observable<any> {
     return new Observable(observer => {
       this.observer = observer;
     });
 }

 private handleError(error) {
     console.error('server error:', error);
     if (error.error instanceof Error) {
         let errMessage = error.error.message;
         return Observable.throw(errMessage);
     }
     return Observable.throw(error || 'Socket.io server error');
   }



    // Emits login setup message
    loginEmit(){
      this.socket.emit("loginSetup",this.userDetails._id);
    }

    // Observable to keep track of the current user.
      getCurrentUser(): void {
      this.dataService.getCurrentUser()
          .subscribe(currentUser => this.userDetails = currentUser);
    }
}
