import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PoModule, PoPageModule } from '@po-ui/ng-components';
import { PoPageDynamicSearchModule, PoTemplatesModule } from '@po-ui/ng-templates';
import { FormsModule } from '@angular/forms';
import { ManualPresenceComponent } from './manual-presence.component';
import { ManualPresenceService } from './../shared/services/manual-presence.service'

@NgModule({
  declarations: [ManualPresenceComponent],
  imports: [
    CommonModule,
    FormsModule,
    PoModule,
    PoTemplatesModule,
    PoPageModule,
    PoPageDynamicSearchModule
  ],
  providers: [ManualPresenceService]
})
export class ManualPresenceModule { }
