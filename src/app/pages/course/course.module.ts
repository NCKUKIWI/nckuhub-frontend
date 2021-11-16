import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from 'src/app/shared/share.module';
import {CourseRoutingModule} from './course-routing.module';
import {CourseComponent} from './course.component';


@NgModule({
  declarations: [
    CourseComponent
  ],
  imports: [
    CourseRoutingModule,
    CommonModule,
    SharedModule
  ]
})
export class CourseModule { }
