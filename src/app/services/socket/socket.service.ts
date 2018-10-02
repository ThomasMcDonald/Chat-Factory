import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Observer } from 'rxjs/Observer';

import { DataService } from '../data/data.service'
import { HttpClient } from '@angular/common/http';
import io from "socket.io-client";


/*

This service handles all incoming and outgoing traffic via sockets.
see below for function definitions.
*/
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

}

  // Connect Socket
  public initSocket(){
    this.socket = io.connect(this.url);
    this.getCurrentUser();
    this.socket.on('newData', (res) => {
    //  if(res.owner == this.userDetails._id || res.owner == "All"){
        this.socket.emit("requestData",this.userDetails);
    //  }
    });

    this.loginSetup();
  }

// emits the loginSetup message to the server
  public loginSetup(){
    this.socket.emit("loginSetup",this.userDetails);
  }

// Disconnects the socket.
  public logout(){
    this.socket.disconnect();
  }

//Asks the server to add the user to the given room
  public joinRoom(room,user) {
    if(room != 0){
      this.socket.emit('subscribe', {room: room, user:user});
    }
  }
// Remove the user from the given room
  public leaveRoom(room,user) {
    if(room != 0){
      this.socket.emit('unsubscribe',  {room: room, user:user});
    }
  }

// Send message to given Room
  public sendMessage(room,msg){
    this.socket.emit("roomyMessage",{room:room, msg:msg, from:{_id:this.userDetails._id,_username:this.userDetails._username, _profileImage:this.userDetails._profileImage}})
  }

// Send message/img to given Room
  public sendMessagewithImage(room,msg,Img){
    this.socket.emit("roomyMessage",{room:room, msg:msg, img: Img,from:{_id:this.userDetails._id,_username:this.userDetails._username, _profileImage:this.userDetails._profileImage}})
  }

// This is an observable that a component subscribes to, it will update the user whenever new content has been added. This excludes messages.
  updateData(): Observable<any> {
   this.socket.on('updatedData', (res) => {
     this.dataObserver.next(res);
   });
   return new Observable(dataObserver => {
     this.dataObserver = dataObserver;
   });
 }

// This is an observable that the room component subscribes to, it will update the room everytime a new message has been sent.
 getMessages(): Observable<any> {
   this.socket.on('message', (message) => {
     this.messageObserver.next(message);
   });
   return new Observable(messageObserver => {
     this.messageObserver = messageObserver;
   });
 }

//This is a sneaky handler that will works with the observables.
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
