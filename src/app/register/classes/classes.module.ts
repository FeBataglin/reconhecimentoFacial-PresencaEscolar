import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PoModule } from '@po-ui/ng-components';
import { PoPageDynamicSearchModule, PoTemplatesModule } from '@po-ui/ng-templates';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClassesComponent } from './classes.component';
import { ClassesRoutingModule } from './classes-routing.module'
import { ClassesEditComponent } from './edit/classes-edit.component';

@NgModule({
  declarations: [ClassesComponent, ClassesEditComponent],
  exports: [ClassesEditComponent],
  imports: [
    CommonModule,
    PoModule,
    PoTemplatesModule,
    PoPageDynamicSearchModule,
    FormsModule,
    ClassesRoutingModule,
    ReactiveFormsModule,
  ]
})
export class ClassesModule { }
