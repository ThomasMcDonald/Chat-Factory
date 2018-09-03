import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { HttpClient } from '@angular/common/http';

import {FormControl, FormGroup, FormGroupDirective, NgForm, Validators, FormBuilder} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import { DataService } from '../../services/data/data.service'


@Component({
  selector: 'app-remove-user-group-channel',
  templateUrl: './remove-user-group-channel.component.html',
  styleUrls: ['./remove-user-group-channel.component.css']
})
export class RemoveUserGroupChannelComponent implements OnInit {

  addUser;
  channelID;
  option;
  userDetails;
  get url():String {
    return this.dataService.url;
  }

  get Users():any[]{
    return this.dataService.Users;
  }


  constructor(private dataService: DataService,public dialogRef: MatDialogRef<RemoveUserGroupChannelComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private http: HttpClient) {
  this.channelID = this.data.channelID;
  this.option = this.data.option;
  this.userDetails = this.data.userDetails;
  console.log(this.userDetails);
}

  ngOnInit() {

  }
  onCloseConfirm(){
    console.log(this.option);
    this.http.post(this.url+'/removeUserFromGroupChannel', {option: this.option, removeID:this.channelID, userID: this.addUser})
      .subscribe(
        res => {
          if(res['statusCode'] == "UserError"){
            console.log(res['msg'])
            
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
}
