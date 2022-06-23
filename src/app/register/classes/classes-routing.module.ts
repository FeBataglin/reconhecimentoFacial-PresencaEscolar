import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClassesEditComponent } from './edit/classes-edit.component';
import { ClassesComponent } from './classes.component';

export const routes: Routes = [
    {
        path: '',
        component: ClassesComponent,
    },
    {
        path: 'edit/:id',
        component: ClassesEditComponent,
    },
];

@NgModule({
    declarations: [],
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class ClassesRoutingModule { }


