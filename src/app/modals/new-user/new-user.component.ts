import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { HttpClient } from '@angular/common/http';

import {FormControl, FormGroup, FormGroupDirective, NgForm, Validators, FormBuilder} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';


@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.css']
})
export class NewUserComponent implements OnInit {
  private url = 'http://localhost:8080';
  private C9URL = 'https://node-garbage-thomasmcdonald1996.c9users.io';
  private prodURL = 'https://chat-factory.herokuapp.com';
  newUserForm = this.fb.group({
    email: ['', Validators.required],
    username: ['', Validators.required],
    role: ['',Validators.required]
  });


  constructor(public dialogRef: MatDialogRef<NewUserComponent>, private fb: FormBuilder, private http: HttpClient) { }

  ngOnInit() {
  }

  onCloseConfirm() {
    this.http.post(this.prodURL+'/createUser', this.newUserForm.value)
      .subscribe(
        res => {
          this.dialogRef.close(res);
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
