import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { Inject } from '@angular/core';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-add-to-group',
  templateUrl: './add-to-group.component.html',
  styleUrls: ['./add-to-group.component.css']
})
export class AddToGroupComponent implements OnInit {
  Users;
  userDetails;
  constructor(private dataService: DataService,public dialogRef: MatDialogRef<AddToGroupComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.Users = data.Users;
    this.userDetails = this.dataService.getCurrentUser();
    this.userDetails = this.userDetails.value
   }

  ngOnInit() {
  }

  onCloseCancel() {
    this.dialogRef.close();
  }
}
