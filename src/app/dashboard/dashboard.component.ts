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
  private socket;
  public userDetails;
  constructor(private router: Router) {
    this.userDetails = JSON.parse(localStorage.getItem('UserDetails'));
  }

  ngOnInit() {
    this.socket = io.connect(this.url);
    this.socket.emit("loginSetup",this.userDetails._id);
    this.socket.on("loginDetails", (data) =>{
      console.log(data) // This is all the Data I sent from the server (Groups, Channels and Users)
    })
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
