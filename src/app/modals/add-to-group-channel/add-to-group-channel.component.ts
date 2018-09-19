import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { HttpClient } from '@angular/common/http';

import {FormControl, FormGroup, FormGroupDirective, NgForm, Validators, FormBuilder} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import { DataService } from '../../services/data/data.service'


@Component({
  selector: 'AddToChannelGroupComponent',
  templateUrl: './add-to-group-channel.component.html',
  styleUrls: ['./add-to-group-channel.component.css']
})
export class AddToGroupChannelComponent implements OnInit {

  addUser;
  channelID;
  option;
  userDetails;
  groupID;
  get url():String {
    return this.dataService.url;
  }

  get Users():any[]{
    return this.dataService.Users;
  }


  constructor(private dataService: DataService,public dialogRef: MatDialogRef<AddToGroupChannelComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private http: HttpClient) {
  this.channelID = this.data.channelID;
  this.option = this.data.option;
  this.userDetails = this.data.userDetails;
  this.groupID = this.data.group;

}

  ngOnInit() {

  }
  onCloseConfirm(){
    this.http.post(this.url+'/addUsertoGroupChannel', {option: this.option, channelID:this.channelID, userID: this.addUser, groupID:this.groupID})
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
