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
  dataObserver: Observer<any>;
  messageObserver: Observer<any>;
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

  public logout(){
    this.socket.disconnect();
  }

  public joinRoom(room) {
    this.socket.emit('subscribe', room);
  }

  public leaveRoom(room) {
    this.socket.emit('unsubscribe', room);
  }

  public sendMessage(room,msg){
    this.socket.emit("roomyMessage",{room:room, msg:msg})
  }

  updateData(): Observable<any> {
   this.socket.on('updatedData', (res) => {
     this.dataObserver.next(res);
   });
   return new Observable(dataObserver => {
     this.dataObserver = dataObserver;
   });
 }

 getMessages(): Observable<any> {
   this.socket.on('message', (message) => {
     this.messageObserver.next(message);
   });
   return new Observable(messageObserver => {
     this.messageObserver = messageObserver;
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
