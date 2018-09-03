import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar} from '@angular/material';
import { HttpClient } from '@angular/common/http';

import {FormControl, FormGroup, FormGroupDirective, NgForm, Validators, FormBuilder} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import { DataService } from '../../services/data/data.service'

@Component({
  selector: 'app-delete-user',
  templateUrl: './delete-user.component.html',
  styleUrls: ['./delete-user.component.css']
})
export class DeleteUserComponent implements OnInit {
  removeUser;
  channelID;
  userDetails;
  get url():String {
    return this.dataService.url;
  }

  get Users():any[]{
    return this.dataService.Users;
  }


  constructor(private dataService: DataService,public dialogRef: MatDialogRef<DeleteUserComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private http: HttpClient, public snackBar: MatSnackBar) {
  this.userDetails = this.data.userDetails;
  }

  ngOnInit() {

  }
  onCloseConfirm(){
    this.http.post(this.url+'/deleteUser', {userID: this.removeUser})
      .subscribe(
        res => {
          if(res['statusCode'] == "UserError"){
            this.snackBar.open(res['msg'], "", {
              duration: 2000,
            });
          }
          else{
            this.dialogRef.close(res);
          }
        },
        err => {
          this.snackBar.open("Http error", "", {
            duration: 2000,
          });
        }
      );
  }
}
