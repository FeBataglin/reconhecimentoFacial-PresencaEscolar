import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PoModule } from '@po-ui/ng-components';
import { PoPageDynamicSearchModule, PoTemplatesModule } from '@po-ui/ng-templates';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StudentsComponent } from './students.component';
import { StudentsEditComponent } from './edit/students-edit.component';
import { StudentsRoutingModule } from './students-routing.module';

@NgModule({
  declarations: [StudentsComponent, StudentsEditComponent],
  imports: [
    CommonModule,
    PoTemplatesModule,
    PoModule,
    PoPageDynamicSearchModule,
    FormsModule,
    StudentsRoutingModule,
    ReactiveFormsModule
  ]
})
export class StudentsModule { }
