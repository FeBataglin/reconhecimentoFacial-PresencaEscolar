import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { ManualPresenceComponent } from './manual-presence/manual-presence.component';
import { PresenceListComponent } from './presence-list/presence-list.component';
import { RecognitionComponent } from './recognition/recognition.component';

const routes: Routes = [
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then(m => m.RegisterModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
    component: DashboardComponent
  },
  {
    path: 'recognition',
    loadChildren: () => import('./recognition/recognition.module').then(m => m.RecognitionModule),
    component: RecognitionComponent
  },
  {
    path: 'presenceList',
    loadChildren: () => import('./presence-list/presence-list.module').then(m => m.PresenceListModule),
    component: PresenceListComponent
  },
  {
    path: 'manualPresence',
    loadChildren: () => import('./manual-presence/manual-presence.module').then(m => m.ManualPresenceModule),
    component: ManualPresenceComponent
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginModule),
    component: LoginComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})

export class AppRoutingModule { }
