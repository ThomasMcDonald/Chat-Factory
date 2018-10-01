import { Component, OnInit, Inject,ElementRef, ViewChild } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { HttpClient } from '@angular/common/http';
import {  FileUploader, FileSelectDirective } from 'ng2-file-upload/ng2-file-upload';

import {FormControl, FormGroup, FormGroupDirective, NgForm, Validators, FormBuilder} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import { DataService } from '../../services/data/data.service'

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.css']
})
export class NewUserComponent implements OnInit {
  get url():string {
    return this.dataService.url;
  }

  @ViewChild('fileInput') fileInput: ElementRef;

  errorMsg;
  showSpinner;
  newUserForm = this.fb.group({
    email: ['', Validators.required],
    username: ['', Validators.required],
    role: ['',Validators.required],
    profileImg: null
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

  onFileChange(event) {
    console.log(event);
    let reader = new FileReader();
    if(event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        console.log(file)
        this.newUserForm.get('profileImg').setValue(reader.result.split(',')[1])
        // this.newUserForm.get('profileImg').setValue({
        //   filename: file.name,
        //   filetype: file.type,
        //   value: reader.result.split(',')[1]
        // })
      };
    }
  }

}
