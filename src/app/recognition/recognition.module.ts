import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PoModule } from '@po-ui/ng-components';
import { PoPageDynamicSearchModule, PoTemplatesModule } from '@po-ui/ng-templates';
import { RecognitionComponent } from './recognition.component';

@NgModule({
  declarations: [RecognitionComponent],
  imports: [
    CommonModule,
    FormsModule,
    PoModule,
    PoTemplatesModule,
    ReactiveFormsModule,
    PoPageDynamicSearchModule
  ]
})
export class RecognitionModule { }
