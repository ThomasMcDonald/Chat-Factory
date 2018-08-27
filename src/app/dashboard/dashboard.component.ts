import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import io from "socket.io-client";
import { DataService } from '../services/data.service'
import { NewUserComponent } from '../modals/new-user/new-user.component';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  private url = 'http://localhost:8080';
  private C9URL = 'https://node-garbage-thomasmcdonald1996.c9users.io';
  private prodURL = 'https://chat-factory.herokuapp.com/';
  
  private socket;
  public userDetails;
  public Groups = [];
  public Channels = [];
  public Users = [];

  messageValue = "";

  constructor(private dataService: DataService,private router: Router, public dialog: MatDialog, private http: HttpClient) {
    this.socket = io.connect(this.prodURL);
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
  }

  ngOnInit() {

  }

  logout(){
    localStorage.removeItem('userDetails');
    this.socket.disconnect();
    this.router.navigate(['/login']);
  }

  createGroup(){
    console.log("Create Group");
  }

  newUserModal(){
    let dialogRef = this.dialog.open(NewUserComponent, {
      width: '600px',
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
    });
  }

  getCurrentUser(): void {
  this.dataService.getCurrentUser()
      .subscribe(currentUser => this.userDetails = currentUser);
}
}
