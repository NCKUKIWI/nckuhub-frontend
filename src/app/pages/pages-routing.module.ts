import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { CourseComponent } from './course/course.component'
import { HomeComponent } from './home/home.component'
import { PageNotFoundComponent } from './page-not-found/page-not-found.component'
import { TimetableComponent } from './timetable/timetable.component'
import { UserComponent } from './user/user.component'

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'course',
    component: CourseComponent,
  },
  {
    path: 'timetable',
    component: TimetableComponent,
  },
  {
    path: 'user',
    component: UserComponent,
  },
  {
    path: '**',
    component: PageNotFoundComponent,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
