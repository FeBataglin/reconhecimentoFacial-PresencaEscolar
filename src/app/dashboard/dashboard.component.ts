import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { faBookOpen, faChalkboard, faChalkboardTeacher, faClipboard, faClipboardCheck, faClipboardList, faFilm, faGraduationCap, faList, faUniversity, faUserGraduate } from '@fortawesome/free-solid-svg-icons';
import * as firebase from "firebase"
import { map } from 'rxjs/operators';
import { UserService } from '../shared/services/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  universityIcon = faUniversity;
  graduationCapIcon = faGraduationCap;
  teacherIcon = faChalkboardTeacher;
  notebookIcon = faBookOpen;
  chalkboardIcon = faChalkboard;
  studentsIcon = faUserGraduate;
  clipboardCheckIcon = faList;
  clipboardIcon = faClipboardList;
  admin: boolean;
  user;
  isHidden;
  userEmail;
  disabled: boolean;

  constructor(private router: Router, private afAuth: AngularFireAuth, private db: AngularFirestore, private userService: UserService) { }

  ngOnInit() {
    this.user = this.afAuth.authState;
    this.user.subscribe(
      (user) => {
        if (user) {
          this.userEmail = user;
          this.getUserAdmin(this.userEmail.email);
        } else {
          this.userEmail = null;
        }
      }
    );
  }

  getUserAdmin(email) {
    this.userService.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].email === email) {
          this.admin = data[i].admin;
          if(!this.admin) {
            //this.isHidden = true;
            this.disabled = false;
          } else {
            this.disabled = true;
            //this.isHidden = false;
          }
        }
      }
    });
  }

  insituitionRegister() {
    this.router.navigate(["register/instituition"])
  }

  coursesRegister() {
    this.router.navigate(["register/courses"])
  }

  classesRegister() {
    this.router.navigate(["register/classes"])
  }

  disciplinesRegister() {
    this.router.navigate(["register/disciplines"])
  }

  responsiblesRegister() {
    this.router.navigate(["register/responsible"])
  }

  studentsRegister() {
    this.router.navigate(["register/students"])
  }

  presenceList() {
    this.router.navigate(["presenceList"])
  }

  manualPresence() {
    this.router.navigate(["manualPresence"])
  }

}
