import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import io from "socket.io-client";

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
  public chatData = [];
  public active = false;
  messageValue = "";
  constructor(private router: Router) {
    this.userDetails = JSON.parse(localStorage.getItem('UserDetails'));
    this.socket = io.connect(this.C9URL);
    this.socket.emit("loginSetup",this.userDetails._id);
    this.socket.on("loginDetails", (data) =>{
      this.chatData = data.groups; // This is all the Data I sent from the server (Groups, Channels and Users)
      console.log(data);
      console.log(this.chatData);
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



}
