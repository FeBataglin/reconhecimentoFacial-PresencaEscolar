import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PoModule } from '@po-ui/ng-components';
import { PoPageDynamicSearchModule, PoTemplatesModule } from '@po-ui/ng-templates';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InstituitionComponent } from './instituition.component';
import { InstituitionEditComponent } from './edit/instituition-edit.component';
import { InstituitionRoutingModule } from './instituition-routing.module';

@NgModule({
  declarations: [InstituitionComponent, InstituitionEditComponent],
  imports: [
    CommonModule,
    PoTemplatesModule,
    PoModule,
    FormsModule,
    PoPageDynamicSearchModule,
    InstituitionRoutingModule,
    ReactiveFormsModule
  ]
})
export class InstituitionModule { }
