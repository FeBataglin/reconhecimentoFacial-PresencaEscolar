import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterRoutingModule } from './register-routing.module';
import { PoModule } from '@po-ui/ng-components';
import { PoPageDynamicSearchModule, PoTemplatesModule } from '@po-ui/ng-templates';
import { FormsModule } from '@angular/forms';
import { RegisterComponent } from './register.component';
import { AngularFireAuthModule } from 'angularfire2/auth';


@NgModule({
  declarations: [RegisterComponent],
  imports: [
    CommonModule,
    RegisterRoutingModule,
    PoModule,
    PoPageDynamicSearchModule,
    PoTemplatesModule,
    FormsModule
  ]
})

export class RegisterModule { }
