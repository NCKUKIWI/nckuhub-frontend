import { Component, OnChanges, OnInit, Optional } from '@angular/core';
import { Router } from '@angular/router';
import { CourseModel } from '../../models/Course.model';
import { CourseService } from '../../services/course.service';
import { take, filter } from 'rxjs/operators';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CourseContentComponent } from '../course-content/course-content.component';


@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss', '../../course.component.css'],
})
export class NavbarComponent implements OnInit, OnChanges {
    public query: string = "";
    public isDropdownOpen: Boolean=false;
    private allCourseInNewSemester: CourseModel[] = [];
    displayCourseList: CourseModel[] = [];
    result: CourseModel[] = [];
    MAX_COURSE_DISPLAY_NUM = 200;
    public search: any = '';

    constructor(
        private router: Router,
        private courseService: CourseService,
        @Optional()
        public ref: DynamicDialogRef,
        private dialogService: DialogService,

    ) {}

    ngOnInit(): void {
        this.getCourseData();
        
    }

    /**
     *  打API拿 完整課程資料，取出部分初始化 展示用課程資料 和 有評論的課程資料
     */
     getCourseData(): void {
        // 加filter是因為可能會收到空陣列
        this.courseService.getCourseData().pipe(filter(data => data.length !== 0), take(1)).subscribe(
            (courseData) => {
                this.allCourseInNewSemester = courseData;
                this.displayCourseList = this.allCourseInNewSemester.slice(0, this.MAX_COURSE_DISPLAY_NUM);
            },
            (err: any) => {
                if (err) {
                    console.error(err);
                }
            });
    }

    deptTransCat(deptID: string, deptName: string): string {
        return this.courseService.deptTransCat(deptID, deptName);
    }

    /**
     * 為課程 打開課程內頁
     * @param courseId 要打開課程內頁的課程的id
     */
    openCoursePage(courseId: number): void {
        this.ref = this.dialogService.open(CourseContentComponent, {
            width: '100%',
            height: '100%',
            baseZIndex: 10000,
            transitionOptions: null,
            style: { marginTop: '-75px' },
            data: { courseId },
        });

        this.ref.onClose.subscribe(() => {
            console.log('The dialog was closed');
            this.router.navigateByUrl('/');
        });
    }

    ngOnChanges():void{
        console.log(this.query)
    }

}
