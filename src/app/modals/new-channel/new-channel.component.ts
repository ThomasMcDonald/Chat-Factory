import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { HttpClient } from '@angular/common/http';

import {FormControl, FormGroup, FormGroupDirective, NgForm, Validators, FormBuilder} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import { DataService } from '../../services/data/data.service'

@Component({
  selector: 'app-new-channel',
  templateUrl: './new-channel.component.html',
  styleUrls: ['./new-channel.component.css']
})
export class NewChannelComponent implements OnInit {
  newGroupForm: FormGroup;
  get url():String {
    return this.dataService.url;
  }
  constructor(private dataService: DataService,public dialogRef: MatDialogRef<NewChannelComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private http: HttpClient) {
    console.log(this.data)
    this.newGroupForm = fb.group({
     name: ['', Validators.required],
     topic: ['', Validators.required],
     groupID: [this.data.selectedGroup,Validators.required],
     owner: [this.data.CurrentUser._id,Validators.required]
   });
 }

  ngOnInit() {

  }

  onCloseConfirm() {
    console.log(this.newGroupForm.value);
    this.http.post(this.url+'/createChannel', this.newGroupForm.value)
      .subscribe(
        res => {
          if(res['statusCode'] == "UserError"){
            console.log(res['msg'])
            //Throw error message for duplicate user here
            //Probably in a text popup
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
    this.dialogRef.close("cancel");
  }

}
