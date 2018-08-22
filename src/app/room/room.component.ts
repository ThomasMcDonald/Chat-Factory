import { Component, OnInit, Input } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {

  currentGroup;
  groupID;
  paramsSubscribe;
  private url = 'http://localhost:8080';
  private C9URL = 'https://node-garbage-thomasmcdonald1996.c9users.io';
  
  
  
  constructor(private activatedRoute: ActivatedRoute, private http: HttpClient) { 
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



getGroup(id){
   this.http.post(this.C9URL+'/getGroup', { groupID: id } ) 
      .subscribe(
        res => {
          this.currentGroup = res['currentGroup'];
        },
        err => {
          console.log("Error occured");
        }
      );
}

}
