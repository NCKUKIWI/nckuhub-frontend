import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CourseComponent } from './course.component';
import { TimetableComponent } from './components/timetable/timetable.component';
import { CourseSearchComponent } from './components/course-search/course-search.component';
import { CourseUserComponent } from './components/user/course-user.component';
import { WishListComponent } from './components/wish-list/wish-list.component';
import { CourseService } from './services/course.service';
import { WishListService } from './services/wish-list.service';
const routes: Routes = [
    {
        path: '',
        component: CourseComponent,
        children: [
            {
                path: 'timetable',
                component: TimetableComponent,
            },
            {
                path: 'search',
                component: CourseSearchComponent,
            },
            {
                path: 'user',
                component: CourseUserComponent,
            },
            {
                path: 'wish-list',
                component: WishListComponent,
            },
            {
                path: ':course_id',
                component: CourseComponent,
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
