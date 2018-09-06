import { Component, OnInit, Input } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { DataService } from '../services/data/data.service'

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {

  currentGroup;
  selectedChannel = 0;
  groupID;
  channelID;
  paramsSubscribe;
  get Users():any[] {
    return this.dataService.Users;
  }

  get url():String {
    return this.dataService.url;
  }


  constructor(private dataService: DataService,private activatedRoute: ActivatedRoute, private router: Router, public dialog: MatDialog, private http: HttpClient) {
   this.paramsSubscribe=this.activatedRoute.params.subscribe(params => {
      this.channelID = params['channelID'];
      this.groupID = params['id'];
     // this.getGroup(this.groupID);
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

// getGroup(id){
//   this.http.post(this.url+'/getGroup', { groupID: id } )
//       .subscribe(
//         res => {
//           this.currentGroup = res['currentGroup'];
//         },
//         err => {
//           console.log("Error occured");
//         }
//       );
// }

}
