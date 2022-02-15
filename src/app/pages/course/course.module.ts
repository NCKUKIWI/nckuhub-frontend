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
import { CourseContentComponent } from './components/course-content/course-content.component';
import { WriteCommentComponent } from './components/write-comment/write-comment.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { DialogService } from 'primeng/dynamicdialog';
import { TableCellComponent } from './components/timetable/table-cell/table-cell.component';
import { ResultListItemComponent } from './components/timetable/result-list-item/result-list-item.component';
import { WishlistItemComponent } from './components/timetable/wishlist-item/wishlist-item.component';

@NgModule({
    declarations: [CourseContentComponent, CourseComponent, TimetableComponent, NavbarComponent, CourseSearchComponent, WishListComponent, CourseUserComponent, WriteCommentComponent, TableCellComponent, ResultListItemComponent, WishlistItemComponent],
    imports: [CourseRoutingModule, CommonModule, SharedModule, FormsModule, ReactiveFormsModule, DynamicDialogModule],
    providers: [DialogService],
})
export class CourseModule {}
