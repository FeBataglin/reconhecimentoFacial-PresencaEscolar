import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DisciplinesComponent } from './disciplines.component';
import { DisciplinesEditComponent } from './edit/disciplines-edit.component';
import { DisciplinesRoutingModule } from './disciplines-routing.module'
import { PoPageDynamicSearchModule, PoTemplatesModule } from '@po-ui/ng-templates';
import { PoModule } from '@po-ui/ng-components';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [DisciplinesComponent, DisciplinesEditComponent],
  imports: [
    CommonModule,
    DisciplinesRoutingModule,
    PoTemplatesModule,
    PoModule,
    FormsModule,
    PoPageDynamicSearchModule,
    ReactiveFormsModule
  ]
})
export class DisciplinesModule { }
