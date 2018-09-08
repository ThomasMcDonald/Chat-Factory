import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '../login/login.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { RoomComponent } from '../room/room.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent,
    children: [
            {
                path:'',
                redirectTo: 'channels/0/0',
                pathMatch: 'full'
            },
            {
                path:'channels/:groupID/:channelID',
                component: RoomComponent,
            }
          ]
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})





export class AppRoutingModule {}
