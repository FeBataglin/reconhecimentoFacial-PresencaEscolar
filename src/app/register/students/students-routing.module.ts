import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentsComponent } from './students.component';
import { StudentsEditComponent } from './edit/students-edit.component';

export const routes: Routes = [
    {
        path: '',
        component: StudentsComponent,
    },
    {
        path: 'edit/:id',
        component: StudentsEditComponent,
    },
];

@NgModule({
    declarations: [],
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class StudentsRoutingModule { }


