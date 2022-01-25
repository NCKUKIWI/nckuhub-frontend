import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CourseContentComponent } from './components/course-content/course-content.component';
import { CourseSearchComponent } from './components/course-search/course-search.component';
import { TimetableComponent } from './components/timetable/timetable.component';
import { CourseUserComponent } from './components/user/course-user.component';
import { WriteCommentComponent } from './components/write-comment/write-comment.component';
import { CourseComponent } from './course.component';
import { CourseService } from './services/course.service';
import { WishListService } from './services/wish-list.service';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'search',
        pathMatch: 'full',
    },
    {
        path: '',
        component: CourseComponent,
        children: [
            {
                path: 'comment',
                component: WriteCommentComponent,
            },
            {
                path: 'timetable',
                component: TimetableComponent,
                // canActivate: []
            },
            {
                path: 'search',
                component: CourseSearchComponent,
            },
            {
                path: 'user',
                component: CourseUserComponent,
                // canActivate: []
            },
            {
                path: ':courseId',
                component: CourseContentComponent,
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [CourseService, WishListService],
})
export class CourseRoutingModule {}
