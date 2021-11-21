import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CourseComponent } from './course.component';
import {TimetableComponent} from './timetable/timetable.component';
const routes: Routes = [
  {
      path: '',
      component: CourseComponent,
      children: [
        // {
        //   path: '/timetable',
        //   component: TimetableComponent,
        // }
        // {
        //   path: '/courseId/:id',
        //   component: ,
        // },
        // {
        //   path: '/teacherId/:id',
        //   component: ,
        // }
      ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
})
export class CourseRoutingModule {}
