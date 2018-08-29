import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import io from "socket.io-client";
import { DataService } from '../services/data.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public socket;
  get url():String {
    return this.dataService.url;
  }
  
  public userDetails = {
    username: "",
    password: "",
  }

  constructor(private dataService: DataService, private http: HttpClient,private router: Router) {

   }

  ngOnInit() {
  }


  // Once i get the positve response back I need to save details in local storage
  login(){
    this.http.post(this.url+'/loginVerify', this.userDetails) // Sending password with no hash ;)
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
