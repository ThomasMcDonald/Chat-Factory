import { Component, OnInit, Input } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { DataService } from '../services/data/data.service'
import { SocketService } from '../services/socket/socket.service'
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {

  messagesSub: Subscription;
  public userDetails;


  groupID = 0;
  channelID = 0;
  inputMessage = "";

  paramsSubscribe;
  Messages = [];
  get Users():any[] {
    return this.dataService.Users;
  }

  get url():String {
    return this.dataService.url;
  }


  constructor(private socketService: SocketService, private dataService: DataService,private activatedRoute: ActivatedRoute, private router: Router, public dialog: MatDialog, private http: HttpClient) {
    this.getCurrentUser();
   this.paramsSubscribe=this.activatedRoute.params.subscribe(params => {
      this.socketService.leaveRoom(this.channelID);
      
      this.channelID = params['channelID'];
      this.groupID = params['id'];
      this.Messages = [];
      
      this.socketService.joinRoom(this.channelID);
      


    });
  }
  ngOnInit() {
    this.messagesSub = this.socketService.getMessages()
      .subscribe(message => {
          switch(message.status){
            case "joined":
                  if(message.user._id == this.userDetails._id){
                      console.log("You Joined the Channel")
                  }else{
                    console.log(message.user._username + " Has Joined the Channel")
                  }
                  break;
            case "channelContent":
                  this.Messages = message.content;
                  console.log(this.Messages);
                  break;
            case "left":
                  console.log(message.user._username + " Has Left the Channel")
                  break;
            case "message":
                  this.Messages.push({from:message.user, _content:message.content});
                  console.log(this.Messages);
                  break;
          }
          //messages.push(messages);
      });

  }
  //Send message to server for room distribution
  sendMessage(){
    if(this.inputMessage.localeCompare("") != 0 || this.inputMessage.localeCompare(" ") != 0){
      this.socketService.sendMessage(this.channelID,this.inputMessage);
      this.inputMessage = "";
    }else{
      console.log("no empty messages please")
    }
  }
  // Observable to keep track of the current user.
  getCurrentUser(): void {
    this.dataService.getCurrentUser()
      .subscribe(currentUser => this.userDetails = currentUser);
  }


  ngOnDestroy() {
    this.messagesSub.unsubscribe();
    this.paramsSubscribe.unsubscribe();
}

}
