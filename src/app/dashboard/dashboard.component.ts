import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import io from "socket.io-client";
import { NewUserComponent } from '../new-user/new-user.component';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  private url = 'http://localhost:8080';
  public C9URL = 'https://node-garbage-thomasmcdonald1996.c9users.io';
  private socket;
  public userDetails;
  
  public Groups = [];
  public Channels = [];
  public Users = [];
  
  messageValue = "";
  
  constructor(private router: Router, public dialog: MatDialog, private http: HttpClient) {
    this.userDetails = JSON.parse(localStorage.getItem('UserDetails'));
    this.socket = io.connect(this.C9URL);
    this.socket.emit("loginSetup",this.userDetails._id);
    this.socket.on("loginDetails", (data) =>{
      this.Groups = data.groups;
      this.Users = data.users;
      this.Channels = data.channels;
      console.log(data);
      console.log(this.Groups);
    })
    
     this.socket.on("newUser", (data) =>{
      this.Users = data.users; // This is all the Data I sent from the server (Groups, Channels and Users)
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
      data: 'This text is passed into the dialog!'
    });
    dialogRef.afterClosed().subscribe(result => {
      this.createUser(result);
    });
  }
  
   createUser(result){
    this.http.post(this.C9URL+'/createUser', result) 
      .subscribe(
        res => {
            console.log(res)
        },
        err => {
          console.log("Error occured");
        }
      );
  }



}
