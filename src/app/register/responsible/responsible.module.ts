import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PoModule } from '@po-ui/ng-components';
import { PoPageDynamicSearchModule, PoTemplatesModule } from '@po-ui/ng-templates';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ResponsibleComponent } from './responsible.component';
import { ResponsibleEditComponent } from './edit/responsible-edit.component';
import { ResponsibleRoutingModule } from './responsible-routing.module';

@NgModule({
  declarations: [ResponsibleComponent, ResponsibleEditComponent],
  imports: [
    CommonModule,
    PoModule,
    PoPageDynamicSearchModule,
    PoTemplatesModule,
    FormsModule,
    ResponsibleRoutingModule,
    ReactiveFormsModule
  ]
})
export class ResponsibleModule { }
