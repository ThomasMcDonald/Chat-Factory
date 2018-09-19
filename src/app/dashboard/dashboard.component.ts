import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import io from "socket.io-client";
import { Subscription } from 'rxjs/Subscription';

import { DataService } from '../services/data/data.service'
import { SocketService } from '../services/socket/socket.service'
import { NewUserComponent } from '../modals/new-user/new-user.component';
import { NewGroupComponent } from '../modals/new-group/new-group.component';
import { NewChannelComponent } from '../modals/new-channel/new-channel.component';
import { AddToGroupChannelComponent } from '../modals/add-to-group-channel/add-to-group-channel.component';
import { RemoveUserGroupChannelComponent } from '../modals/remove-user-group-channel/remove-user-group-channel.component';
import { DeleteUserComponent } from '../modals/delete-user/delete-user.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar, MatMenuTrigger } from '@angular/material';
import { ViewChild } from '@angular/core';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  get url(): String {
    return this.dataService.url;
  }

  sub: Subscription;
  private socket;
  public userDetails;
  public Groups = [];
  public Channels = [];
  public Users = [];
  public selectedGroup = 0;
  public selectedChannel = 0;

  constructor(private socketService: SocketService, private dataService: DataService, private router: Router, public dialog: MatDialog, private http: HttpClient, public snackBar: MatSnackBar) {
    this.socketService.initSocket();
    this.getCurrentUser();

  }

  ngOnInit() {
    this.sub = this.socketService.updateData()
      .subscribe(quote => {
        console.log(quote)
        this.dataService.Groups = this.Groups = quote.groups;
        this.dataService.Users = this.Users = quote.users;

        if (this.Groups.length > 0 && this.selectedChannel == 0 && this.selectedGroup == 0) {
          this.selectedChannel = this.Groups[0]._activeChannel;
          this.selectedGroup = this.Groups[0]._id;
          this.router.navigate(['dashboard', 'channels', this.selectedGroup, this.selectedChannel]);
        }
      });

  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  // Logs the user out and removes the local storage containing the user details
  logout() {
    this.dataService.removeCurrentUserStorage();
    this.socketService.logout();
    this.socketService.leaveRoom(this.selectedChannel,this.userDetails);
    this.router.navigate(['/login']);
  }

  // Opens the Modal to create a new user
  newUserModal() {
    let dialogRef = this.dialog.open(NewUserComponent, {
      width: '600px',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.snackBar.open("User Created", "", {
          duration: 2000,
        });

      }
    });
  }


  deleteUser() {
    let dialogRef = this.dialog.open(DeleteUserComponent, {
      width: '600px',
      data: { userDetails: this.userDetails }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.snackBar.open("User Deleted", "", {
        duration: 2000,
      });
    });
  }

  // Opens the Modal to create a new group
  newGroupModal() {
    let dialogRef = this.dialog.open(NewGroupComponent, {
      width: '600px',
      data: { CurrentUser: this.userDetails }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.snackBar.open("Group Created", "", {
          duration: 2000,
        });

      }
      //  this.dataService.Groups = this.Groups = result.groups;
    });
  }

  // Opens the Modal to create a new channel in a group
  newChannelModal() {
    let dialogRef = this.dialog.open(NewChannelComponent, {
      width: '600px',
      data: { CurrentUser: this.userDetails, selectedGroup: this.selectedGroup }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined || result == "cancel") {
        this.snackBar.open("Channel Created", "", {
          duration: 2000,
        });

      }
    });
  }



  // HTTP request to remove the requested channel
  removeChannel(channelID, selectedGroup) {
    this.http.post(this.url + '/removeChannel', { channelID: channelID, groupID: selectedGroup })
      .subscribe(
        res => {
          if (res['statusCode'] == "Success") {
            this.snackBar.open(res['msg'], "", {
              duration: 2000,
            });
          }
        },
        err => {
          this.snackBar.open("HTTP Error", "", {
            duration: 2000,
          });
        }
      );
  }

  // HTTP request to remove the requested group
  deleteGroup(id) {
    this.http.post(this.url + '/removeGroup', { _groupID: id })
      .subscribe(
        res => {
          if (res['statusCode'] == "Success") {
            this.router.navigate(['dashboard']);
            this.selectedGroup = 0;
            this.selectedChannel = 0;
            console.log(this.Groups);
            this.snackBar.open("Group Deleted", "", {
              duration: 2000,
            });
          }
        },
        err => {
          this.snackBar.open("ERROR: Connection Issue", "", {
            duration: 2000,
          });
        }
      );
  }

  // Opens Modal For inviting User to group or channel depending on option given
  inviteToGroupChannel(option, id) {
  var channelID = id;
  if(option == "Group") {
    for(var i=0;i<this.Groups.length;i++){
      if(this.Groups[i]._id == this.selectedGroup){
        channelID = this.Groups[i]._channels[0]._id;
      }
    }
  }
    let dialogRef = this.dialog.open(AddToGroupChannelComponent, {
      width: '600px',
      data: { option: option, channelID: channelID, userDetails: this.userDetails, group: this.selectedGroup }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
    });
  }


  // Opens Modal For Removing User from group or channel depending on option given
  removeFromGroupchannel(option, id) {
    let dialogRef = this.dialog.open(RemoveUserGroupChannelComponent, {
      width: '600px',
      data: { option: option, channelID: id, userDetails: this.userDetails }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.snackBar.open("User Removed From " + option, "", {
          duration: 2000,
        });
      }
    });
  }

  // Changes the currently selected group and channel
  selectGroupChannel(groupID, channelID) {
    this.selectedGroup = groupID
    this.selectedChannel = channelID

  }

  // Observable to keep track of the current user.
  getCurrentUser(): void {
    this.dataService.getCurrentUser()
      .subscribe(currentUser => this.userDetails = currentUser);
  }

  // Gets the best channel for the current group
  // This is called on the route and the function above
  relaventChannel(groupID) {
    var relChannels = [];
    if (this.Channels == undefined) return 0;

    for (var i = 0; i < this.Channels.length; i++) {
      if (this.Channels[i]._groupID == groupID) {
        relChannels.push(this.Channels[i]);
      }
    }
    relChannels = relChannels.sort();
    for (var i = 0; i < relChannels.length; i++) {
      if (relChannels[i]._id == this.selectedChannel) {
        return relChannels[i]._id;
      }
    }

    return 0;
  }

  rightClick() {
    console.log("Context Matters")
    return false;
  }

  // This function gets the first letter of the first and second word
  // Creates an acronym for display
  groupAcronym(s) {
    var words, acronym, nextWord;

    words = s.split(' ');
    acronym = "";
    for (var i = 0; i < 2; i++) {
      nextWord = words[i];
      acronym = acronym + nextWord.charAt(0);
      if (words.length == 1) { break; }
    }
    return acronym
  }

  // Essentially this funciton is being used to see if the Group function has finished its init
  hasProp(o) {
    return !(o == undefined);
  }
}
