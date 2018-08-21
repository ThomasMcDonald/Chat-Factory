import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {FormControl, FormGroup, FormGroupDirective, NgForm, Validators, FormBuilder} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';


@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.css']
})
export class NewUserComponent implements OnInit {
  

  newUserForm = this.fb.group({
    email: ['', Validators.required],
    username: ['', Validators.required],
    role: ['',Validators.required]
  });

  
  constructor(public dialogRef: MatDialogRef<NewUserComponent>, private fb: FormBuilder) { }

  ngOnInit() {
  }
  
  onCloseConfirm() {
    this.dialogRef.close(this.newUserForm.value);
  }
  onCloseCancel() {
    this.dialogRef.close();
  }

}
