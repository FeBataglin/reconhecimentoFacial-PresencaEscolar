import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InstituitionComponent } from './instituition.component';
import { InstituitionEditComponent } from './edit/instituition-edit.component';

export const routes: Routes = [
    {
        path: '',
        component: InstituitionComponent,
    },
    {
        path: 'edit/:id',
        component: InstituitionEditComponent,
    },
];

@NgModule({
    declarations: [],
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class InstituitionRoutingModule { }


