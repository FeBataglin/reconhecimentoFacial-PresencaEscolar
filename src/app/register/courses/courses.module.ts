import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PoModule } from '@po-ui/ng-components';
import { PoPageDynamicSearchModule, PoTemplatesModule } from '@po-ui/ng-templates';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoursesComponent } from './courses.component';
import { CourseEditComponent } from './../courses/edit/courses-edit.component';
import { CoursesRoutingModule } from './courses-routing.module';


@NgModule({
  declarations: [CoursesComponent, CourseEditComponent],
  imports: [
    CommonModule,
    PoModule,
    PoPageDynamicSearchModule,
    PoTemplatesModule,
    FormsModule,
    CoursesRoutingModule,
    ReactiveFormsModule
  ]
})
export class CoursesModule { }
