import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoursesComponent } from './courses.component';
import { CourseEditComponent } from './../courses/edit/courses-edit.component';

export const routes: Routes = [
    {
        path: '',
        component: CoursesComponent,
    },
    {
        path: 'edit/:id',
        component: CourseEditComponent,
    },
];

@NgModule({
    declarations: [],
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class CoursesRoutingModule { }


