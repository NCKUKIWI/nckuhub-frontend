import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PageNotFoundComponent} from './pages/page-not-found/page-not-found.component';
const routes: Routes = [
  // TODO: 目前暫定先直接進入course
  {
    path: '',
    loadChildren: () =>
      import('src/app/pages/course/course.module').then(m => m.CourseModule)
  },
  { path: '**',
    pathMatch: 'full',
    component: PageNotFoundComponent
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
