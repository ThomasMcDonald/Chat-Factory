import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import io from "socket.io-client";
import { DataService } from '../services/data/data.service'
import {FormControl, FormGroup, FormGroupDirective, NgForm, Validators, FormBuilder} from '@angular/forms';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  
  showSpinner = false;
  userDetails: FormGroup;
  get url():String {
    return this.dataService.url;
  }


  constructor(private dataService: DataService, private http: HttpClient,private router: Router, private fb: FormBuilder) {
    
   this.userDetails = fb.group({
      username: ["", this.validateName],
      password: "",
    });
    
   }

  ngOnInit() {
  }

  validateName(form) {
      return form.value.trim() !== ""
        ? null
        : {
            validateName: {
              errors: true
            }
          };
    }

  // Once i get the positve response back I need to save details in local storage
  login(){
    this.http.post(this.url+'/loginVerify', this.userDetails.value) // Sending password with no hash ;)
      .subscribe(
        res => {
          if(res['statusCode'] == "initiateSocket"){
            localStorage.setItem('UserDetails', JSON.stringify(res['user']));
            this.router.navigate(['/dashboard']);
          }
          else if(res['statusCode'] == "Error"){
            this.showSpinner = false;
            this.userDetails.controls['username'].setErrors({'incorrect': true});
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
