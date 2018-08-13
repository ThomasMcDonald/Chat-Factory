import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import io from "socket.io-client";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public socket;
  public url = 'http://localhost:8080';
  public userDetails = {
    username: "",
    password: "",
  }

  constructor(private http: HttpClient) {

   }

  ngOnInit() {
  }

  // Once i get the positve response back i need to save details in local storage
  login(){
    this.http.post(this.url+'/loginVerify', this.userDetails) // Sending password with no hash ;)
      .subscribe(
        res => {
          if(res['statusCode'] == "initiateSocket"){
            
          }
        },
        err => {
          console.log("Error occured");
        }
      );
  }


}
