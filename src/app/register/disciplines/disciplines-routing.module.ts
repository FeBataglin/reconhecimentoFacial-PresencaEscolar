import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DisciplinesComponent } from './disciplines.component';
import { DisciplinesEditComponent } from './edit/disciplines-edit.component';

export const routes: Routes = [
    {
        path: '',
        component: DisciplinesComponent,
    },
    {
        path: 'edit/:id',
        component: DisciplinesEditComponent,
    },
];

@NgModule({
    declarations: [],
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class DisciplinesRoutingModule { }


