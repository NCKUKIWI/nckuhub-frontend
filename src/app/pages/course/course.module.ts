import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from 'src/app/shared/share.module';
import {CourseRoutingModule} from './course-routing.module';
import {CourseComponent} from './course.component';
import {TimetableComponent} from './timetable/timetable.component';
import { NavbarComponent } from './navbar/navbar.component';


@NgModule({
  declarations: [
    CourseComponent,
    TimetableComponent,
    NavbarComponent
  ],
  imports: [
    CourseRoutingModule,
    CommonModule,
    SharedModule
  ]
})
export class CourseModule { }
