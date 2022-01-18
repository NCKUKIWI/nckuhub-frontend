import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CourseComponent } from './course.component';
import { TimetableComponent } from './components/timetable/timetable.component';
import { CourseSearchComponent } from './components/course-search/course-search.component';
import { CourseUserComponent } from './components/user/course-user.component';
import { CourseService } from './services/course.service';
import { WishListService } from './services/wish-list.service';
import { CourseContentComponent } from './components/course-content/course-content.component';

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
