import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PoModule } from '@po-ui/ng-components';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
import { PresenceListService } from './shared/services/presence-list.service';
import { ManualPresenceService } from './shared/services/manual-presence.service'
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { environment } from '../environments/environment';
import { StudentService } from './shared/services/student.service';
import { AngularFireStorageModule } from '@angular/fire/storage'
import { DisciplineService } from './shared/services/discipline.service';
import { RecognitionService } from './shared/services/recognition.service';
import { ClassService } from './shared/services/class.service';
import { CourseService } from './shared/services/course.service';
import { InstituitionService } from './shared/services/instituition.service';
import { ResponsibleService } from './shared/services/responsible.service';
import { ConsultaCEPService } from './shared/services/consultaCEP.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    PoModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule.forRoot(),
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    FontAwesomeModule,
    AngularFireAuthModule,
    AngularFirestoreModule
  ],
  providers: [
    AppComponent,
    PresenceListService,
    ManualPresenceService,
    StudentService,
    DisciplineService,
    RecognitionService,
    ClassService,
    CourseService,
    InstituitionService,
    ResponsibleService,
    ConsultaCEPService, 
  ],
  bootstrap: [
    AppComponent
  ]
})

export class AppModule { }
