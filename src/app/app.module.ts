import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule} from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule }     from './app-routing/app-routing.module';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule, MatRadioModule, MatInputModule, MatFormFieldModule, MatIconModule, MatToolbarModule, MatButtonModule, MatCardModule, MatGridListModule, MatProgressSpinnerModule, MatMenuModule, MatDividerModule, MatListModule, MatDialogModule, MatSelectModule, MatTooltipModule, MatCheckboxModule,MatSnackBarModule } from '@angular/material';

import { AppComponent } from './app.component';

// Pages
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RoomComponent } from './room/room.component';

//Modal Dialog
import { NewUserComponent } from './modals/new-user/new-user.component';
import { NewGroupComponent } from './modals/new-group/new-group.component';
import { NewChannelComponent } from './modals/new-channel/new-channel.component';
import { AddToGroupChannelComponent } from './modals/add-to-group-channel/add-to-group-channel.component';
import { RemoveUserGroupChannelComponent } from './modals/remove-user-group-channel/remove-user-group-channel.component';
import { DeleteUserComponent } from './modals/delete-user/delete-user.component';

// File Uploading
import {FileSelectDirective } from 'ng2-file-upload/ng2-file-upload';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    NewUserComponent,
    RoomComponent,
    NewGroupComponent,
    NewChannelComponent,
    AddToGroupChannelComponent,
    RemoveUserGroupChannelComponent,
    DeleteUserComponent,
    FileSelectDirective
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    HttpClientModule,
    AppRoutingModule,
    MatSidenavModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatGridListModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatDividerModule,
    MatListModule,
    MatDialogModule,
    MatSelectModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatRadioModule,
    MatSnackBarModule
  ],
  entryComponents: [NewUserComponent,NewGroupComponent, NewChannelComponent, AddToGroupChannelComponent, DeleteUserComponent,RemoveUserGroupChannelComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
