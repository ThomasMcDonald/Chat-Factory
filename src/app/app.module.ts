import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule} from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule }     from './app-routing/app-routing.module';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule, MatInputModule, MatFormFieldModule, MatIconModule, MatToolbarModule, MatButtonModule, MatCardModule, MatGridListModule, MatProgressSpinnerModule, MatMenuModule, MatDividerModule, MatListModule, MatDialogModule, MatSelectModule } from '@angular/material';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NewUserComponent } from './new-user/new-user.component';
import { RoomComponent } from './room/room.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    NewUserComponent,
    RoomComponent
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
    MatSelectModule
  ],
  entryComponents: [NewUserComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
