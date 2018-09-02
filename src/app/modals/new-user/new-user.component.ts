import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { HttpClient } from '@angular/common/http';

import {FormControl, FormGroup, FormGroupDirective, NgForm, Validators, FormBuilder} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import { DataService } from '../../services/data/data.service'

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.css']
})
export class NewUserComponent implements OnInit {
  get url():String {
    return this.dataService.url;
  }
  errorMsg;
  showSpinner;
  newUserForm = this.fb.group({
    email: ['', Validators.required],
    username: ['', Validators.required],
    role: ['',Validators.required]
  });


  constructor(private dataService: DataService,public dialogRef: MatDialogRef<NewUserComponent>, private fb: FormBuilder, private http: HttpClient) { }

  ngOnInit() {
  }

  onCloseConfirm() {
    this.errorMsg = "";
    this.http.post(this.url+'/createUser', this.newUserForm.value)
      .subscribe(
        res => {
          if(res['statusCode'] == "UserError"){
            console.log(res['msg'])
            this.showSpinner = false;
            this.newUserForm.controls['username'].setErrors({'Exists': "User Already Exists'"});
            this.errorMsg = res['msg'];
          }
          else{
            this.dialogRef.close(res);
          }
        },
        err => {
          console.log("Error occured", err);
        }
      );
  }
  onCloseCancel() {
    this.dialogRef.close();
  }

}
