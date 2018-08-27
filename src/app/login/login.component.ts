import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import io from "socket.io-client";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public socket;
  public url = 'http://localhost:8080';
  public C9URL = 'https://node-garbage-thomasmcdonald1996.c9users.io';
  private prodURL = 'https://chat-factory.herokuapp.com/';
  public userDetails = {
    username: "",
    password: "",
  }

  constructor(private http: HttpClient,private router: Router) {

   }

  ngOnInit() {
  }


  // Once i get the positve response back I need to save details in local storage
  login(){
    this.http.post(this.prodURL+'/loginVerify', this.userDetails) // Sending password with no hash ;)
      .subscribe(
        res => {
          if(res['statusCode'] == "initiateSocket"){
            localStorage.setItem('UserDetails', JSON.stringify(res['user']));
            this.router.navigate(['/dashboard']);
          }
          else if(res['statusCode'] == "UserError"){
            console.log("User Doesnt Exist")
            this.router.navigate(['/login']);
          }
        },
        err => {
          console.log("Error occured");
        }
      );
  }


}
