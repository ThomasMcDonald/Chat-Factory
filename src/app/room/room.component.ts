import { Component, OnInit, Input } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AddToGroupComponent } from '../modals/add-to-group/add-to-group.component'
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { DataService } from '../services/data.service'
@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {

  currentGroup;
  groupID;
  paramsSubscribe;
  get Users():any[] {
    return this.dataService.Users;
  }

  private url = 'http://localhost:8080';
  private C9URL = 'https://node-garbage-thomasmcdonald1996.c9users.io';
  private prodURL = 'https://chat-factory.herokuapp.com/';
  

  constructor(private dataService: DataService,private activatedRoute: ActivatedRoute, private router: Router, public dialog: MatDialog, private http: HttpClient) {
   this.paramsSubscribe=this.activatedRoute.params.subscribe(params => {
      this.groupID = params['id'];
      this.getGroup(this.groupID);
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.paramsSubscribe.unsubscribe();
}

//Add user to group
addToGroup(groupID, userID){
  console.log(groupID);
  console.log(userID);
}

getGroup(id){
   this.http.post(this.prodURL+'/getGroup', { groupID: id } )
      .subscribe(
        res => {
          this.currentGroup = res['currentGroup'];
        },
        err => {
          console.log("Error occured");
        }
      );
}

// Open add to group modal
openAddToGroup(){
  let dialogRef = this.dialog.open(AddToGroupComponent, {
    width: '600px',
    data: { Users: this.Users },
  });
  dialogRef.afterClosed().subscribe(result => {
    console.log(result)
  });
}


}
