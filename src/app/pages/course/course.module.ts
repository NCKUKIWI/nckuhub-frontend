import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/share.module';
import { CourseRoutingModule } from './course-routing.module';
import { CourseComponent } from './course.component';
import { TimetableComponent } from './timetable/timetable.component';
import { NavbarComponent } from './navbar/navbar.component';
import { CourseSearchComponent } from './course-search/course-search.component';
import { WishListComponent } from './wish-list/wish-list.component';
import { CourseUserComponent } from './user/course-user.component';

@NgModule({
    declarations: [
        CourseComponent,
        TimetableComponent,
        NavbarComponent,
        CourseSearchComponent,
        WishListComponent,
        CourseUserComponent,
    ],
    imports: [CourseRoutingModule, CommonModule, SharedModule],
})
export class CourseModule {}
