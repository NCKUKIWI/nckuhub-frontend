import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PageNotFoundComponent} from './pages/page-not-found/page-not-found.component';
const routes: Routes = [
    {
        path: 'course',
        loadChildren: () =>
          import('src/app/pages/course/course.module').then(m => m.CourseModule)
    },
    // TODO: 目前暫定先直接進入course 搜尋頁
    {
        path: '',
        redirectTo: '/course/search',
        pathMatch: 'full',
    },
    {
        path: '**',
        pathMatch: 'full',
        component: PageNotFoundComponent,
    },
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {
            initialNavigation: 'enabled',
        }),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {}

