import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResponsibleComponent } from './responsible.component';
import { ResponsibleEditComponent } from './edit/responsible-edit.component';

export const routes: Routes = [
    {
        path: '',
        component: ResponsibleComponent,
    },
    {
        path: 'edit/:id',
        component: ResponsibleEditComponent,
    },
];

@NgModule({
    declarations: [],
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class ResponsibleRoutingModule { }


