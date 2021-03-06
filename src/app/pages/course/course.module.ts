import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/share.module';
import { CourseRoutingModule } from './course-routing.module';
import { CourseComponent } from './course.component';
import { TimetableComponent } from './components/timetable/timetable.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { CourseSearchComponent } from './components/course-search/course-search.component';
import { WishListComponent } from './components/wish-list/wish-list.component';
import { CourseUserComponent } from './components/user/course-user.component';
import {CourseContentComponent} from './components/course-content/course-content.component';
import { WriteCommentComponent } from './components/write-comment/write-comment.component';

@NgModule({
    declarations: [
        CourseContentComponent,
        CourseComponent,
        TimetableComponent,
        NavbarComponent,
        CourseSearchComponent,
        WishListComponent,
        CourseUserComponent,
        WriteCommentComponent,
    ],
    imports: [CourseRoutingModule, CommonModule, SharedModule],
})
export class CourseModule {}
