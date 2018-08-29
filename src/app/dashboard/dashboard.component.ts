import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import io from "socket.io-client";
import { DataService } from '../services/data.service'
import { NewUserComponent } from '../modals/new-user/new-user.component';
import { NewGroupComponent } from '../modals/new-group/new-group.component';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  private url = 'http://localhost:8080';
  private C9URL = 'https://node-garbage-thomasmcdonald1996.c9users.io';
  private prodURL = 'https://chat-factory.herokuapp.com';

  private socket;
  public userDetails;
  public Groups = [];
  public Channels = [];
  public Users = [];
  public selectedGroup = 0;
  messageValue = "";

  constructor(private dataService: DataService,private router: Router, public dialog: MatDialog, private http: HttpClient) {
    this.socket = io.connect(this.C9URL);
    this.getCurrentUser();
    this.socket.emit("loginSetup",this.userDetails._id);
    this.socket.on("loginDetails", (data) =>{
      this.dataService.Groups = this.Groups = data.groups;
      this.dataService.Users = this.Users = data.users;
      this.dataService.Channels = this.Channels = data.channels;
    })

     this.socket.on("newUser", (data) =>{
      this.dataService.Users = this.Users = data.users; // This is all the Data I sent from the server (Groups, Channels and Users)
      console.log(this.Users);
    })

    this.socket.on("newGroup",(data) =>{
      this.dataService.Groups = this.Groups = data.groups; // This is all the Data I sent from the server (Groups, Channels and Users)
      console.log(this.Groups);
    });
  }

  ngOnInit() {

  }

  logout(){
    localStorage.removeItem('userDetails');
    this.socket.disconnect();
    this.router.navigate(['/login']);
  }


  newUserModal(){
    let dialogRef = this.dialog.open(NewUserComponent, {
      width: '600px',
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
    });
  }

  newGroupModal(){
    let dialogRef = this.dialog.open(NewGroupComponent, {
      width: '600px',
      data: { CurrentUser: this.userDetails }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
    });
  }

  getCurrentUser(): void {
  this.dataService.getCurrentUser()
      .subscribe(currentUser => this.userDetails = currentUser);
}

 groupAcronym(s){
    var words, acronym, nextWord;

    words = s.split(' ');
    acronym = "";
    for(var i=0;i<2;i++) {
            nextWord = words[i];
            acronym = acronym + nextWord.charAt(0);
    }
    return acronym
}
}
