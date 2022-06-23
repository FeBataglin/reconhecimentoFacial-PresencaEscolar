import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PresenceListComponent } from './presence-list.component';
import { PoModule } from '@po-ui/ng-components';
import { PoPageDynamicSearchModule, PoTemplatesModule } from '@po-ui/ng-templates';
import { FormsModule } from '@angular/forms';
import { PresenceListService } from './../shared/services/presence-list.service'

@NgModule({
  declarations: [PresenceListComponent],
  imports: [
    CommonModule,
    PoModule,
    PoPageDynamicSearchModule,
    PoTemplatesModule,
    FormsModule
  ],
  providers: [PresenceListService]
})
export class PresenceListModule { }
