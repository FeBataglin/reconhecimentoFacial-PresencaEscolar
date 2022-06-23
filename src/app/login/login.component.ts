import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User } from '../shared/models/users/user.model';
import { Router } from '@angular/router';
import { PoNotificationService } from '@po-ui/ng-components';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user = {} as User;
  loginForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private poNotification: PoNotificationService,
    private afAuth: AngularFireAuth
    ) { this.createLoginForm(); }

  ngOnInit(): void {
    if (!localStorage.getItem('foo')) { 
      localStorage.setItem('foo', 'no reload') 
      location.reload() 
    } else {
      localStorage.removeItem('foo') 
    }
  }

  createLoginForm() {
    this.loginForm = this.formBuilder.group({
      email: [this.user.email, Validators.required],
      password: [this.user.password, Validators.required]
    });
  }

  loginUser(user: User) {

   this.afAuth.signInWithEmailAndPassword(user.email, user.password)
      .then(data => {
        this.router.navigateByUrl('/dashboard');
      })
      .catch((error) => {
        this.poNotification.error('Por favor, verifique seu login/senha.')
      })
  }

  ngOnDestroy(): void {
    window.location.reload();
  }

}
