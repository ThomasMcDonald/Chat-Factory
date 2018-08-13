import { Component, OnInit } from '@angular/core';
import io from "socket.io-client";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  private url = 'http://localhost:8080';
  private socket;

  constructor() { }

  ngOnInit() {
    this.socket = io.connect(this.url);
    console.log(res['user']._id);
    this.socket.emit("loginSetup",res['user']._id);
    this.socket.on("loginDetails", (data) =>{
      console.log(data)
    })
  }

}
