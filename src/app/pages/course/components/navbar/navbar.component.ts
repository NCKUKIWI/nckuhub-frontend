import { Component, OnChanges, OnInit, DoCheck } from '@angular/core';
import { Router } from '@angular/router';
import { CourseModel } from '../../models/Course.model';
import { CourseService } from '../../services/course.service';
import { take, filter } from 'rxjs/operators';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss', '../../course.component.css'],
})
export class NavbarComponent implements OnInit, OnChanges {
    // public href: string = "";
    public query: string = '';
    public isDropdownOpen: Boolean = false;
    private allCourseInNewSemester: CourseModel[] = [];
    displayCourseList: CourseModel[] = [];
    result: CourseModel[] = [];
    MAX_COURSE_DISPLAY_NUM = 200;
    public search: any = '';
    private searchStatus = false;
    private dropStatus = false;

    constructor(private router: Router, private courseService: CourseService) {}

    ngOnInit(): void {
        // this.href = this.router.url;
        this.getCourseData();
    }

    /**
     *  打API拿 完整課程資料，取出部分初始化 展示用課程資料 和 有評論的課程資料
     */
    getCourseData(): void {
        // 加filter是因為可能會收到空陣列
        this.courseService
            .getCourseData()
            .pipe(
                filter((data) => data.length !== 0),
                take(1)
            )
            .subscribe(
                (courseData) => {
                    this.allCourseInNewSemester = courseData;
                    this.displayCourseList = this.allCourseInNewSemester.slice(0, this.MAX_COURSE_DISPLAY_NUM);
                    // this.allCourseListWithComment = this.allCourseInNewSemester.filter((course) => course.commentNum > 0);
                    // console.log('get course data', courseData.length);
                },
                (err: any) => {
                    if (err) {
                        console.error(err);
                    }
                }
            );
    }

    deptTransCat(deptID: string, deptName: string): string {
        return this.courseService.deptTransCat(deptID, deptName);
    }

    ngOnChanges(): void {
        console.log(this.query);
    }
    // UpdateSearchCourseList():void{
    //     // this.searchCourseList = this.displayCourseList;
    //     console.log("this.result.length:",this.result.length);
    //     console.log(this.result)
    // }

    /**
     * 控制手機板navbar的各個function
     */
    mobileProfile(): void {
        this.isDropdownOpen = !this.isDropdownOpen;
    }

    //功能欠缺(需連動到course_search中class名叫quick_search_area的div)
    mobileDrop(): void {
        this.dropStatus = !this.dropStatus;
    }

    mobileSearch(): void {
        this.searchStatus = true;
    }

    mobileCancellSearch(): void {
        this.searchStatus = false;
    }
}
