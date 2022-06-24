import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { faClipboardCheck } from '@fortawesome/free-solid-svg-icons';
import { PoMenuItem } from '@po-ui/ng-components';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserService } from './shared/services/user.service';
import { map } from 'rxjs/operators';
import { Location } from '@angular/common';

declare const myTest: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isHidden;
  clipboardCheckIcon = faClipboardCheck;
  menuItems: Array<PoMenuItem>;
  user;
  userEmail;
  admin;

  constructor(public router: Router, private afAuth: AngularFireAuth, private userService: UserService, private location: Location) { }

  private changeMenu() {
    this.menuItems = [
      { label: 'Dashboard', icon: 'po-icon-home', link: './dashboard', shortLabel: 'Dashboard' },
      { label: 'Presença por Reconhecimento', icon: 'po-icon-camera', link: './recognition', shortLabel: 'Reconhecer' },
      {
        label: 'Cadastrar',
        icon: 'po-icon-user',
        shortLabel: 'Cadastrar',
        subItems: [
          { label: 'Cadastro de Instituição', link: './register/instituition' },
          { label: 'Cadastro de Cursos', link: './register/courses' },
          { label: 'Cadastro de Turmas', link: './register/classes' },
          { label: 'Cadastro de Disciplina', link: './register/disciplines' },
          { label: 'Cadastro de Responsável', link: './register/responsible' },
          { label: 'Cadastro de Alunos', link: './register/students' },
        ]
      },
      { label: 'Lista de Presença', icon: 'po-icon-list', link: './presenceList', shortLabel: 'Presenças' },
      { label: 'Chamada Manual', icon: 'po-icon-document-filled', link: './manualPresence', shortLabel: 'Manual' },
      { label: 'Sair', icon: 'po-icon-exit', action: this.logout.bind(this), shortLabel: 'Sair' },
    ];
  }

  private changeMenuStudent() {
    this.menuItems = [
      { label: 'Dashboard', icon: 'po-icon-home', link: './dashboard', shortLabel: 'Dashboard' },
      { label: 'Reconhecer', icon: 'po-icon-camera', link: './recognition', shortLabel: 'Reconhecer' },
      { label: 'Lista de Presença', icon: 'po-icon-list', link: './presenceList', shortLabel: 'Presenças' },
      { label: 'Sair', icon: 'po-icon-exit', action: this.logout.bind(this), shortLabel: 'Sair' },
    ];
  }

  logout() {
    this.afAuth.signOut().then(function () {
      console.log("Success to Signout")
    }).catch(function (error) {
      console.log("Fail to Signout")
    });
    this.router.navigateByUrl('/login')
  }

  ngOnInit() {
    this.user = this.afAuth.authState;
    this.user.subscribe(
      (user) => {
        if (user) {
          this.userEmail = user;
          this.getUserAdmin(this.userEmail.email);
        } else {
          this.userEmail = null;
          this.router.navigateByUrl('/login')
        }
      }
    );
    if (window.location.href === "http://localhost:4200/#/login") {
      this.isHidden = true;
    } else {
      this.isHidden = false;
    }
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
          if (this.admin) {
            this.changeMenu();
          } else {
            this.changeMenuStudent();
          }
        }
      }
    });
  }

}
