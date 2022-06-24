import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RegisterComponent } from './register.component';

export const routes: Routes = [
    {
        path: '',
        component: RegisterComponent,
        children: [
            {
                path: 'classes',
                loadChildren: () => import('./classes/classes.module').then(m => m.ClassesModule)
            },
            {
                path: 'courses',
                loadChildren: () => import('./courses/courses.module').then(m => m.CoursesModule)
            },
            {
                path: 'instituition',
                loadChildren: () => import('./instituition/instituition.module').then(m => m.InstituitionModule)
            },
            {
                path: 'responsible',
                loadChildren: () => import('./responsible/responsible.module').then(m => m.ResponsibleModule)
            },
            {
                path: 'students',
                loadChildren: () => import('./students/students.module').then(m => m.StudentsModule)
            },
            {
                path: 'disciplines',
                loadChildren: () => import('./disciplines/disciplines.module').then(m => m.DisciplinesModule)
            }
        ]
    },
];

@NgModule({
    declarations: [],
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class RegisterRoutingModule { }


