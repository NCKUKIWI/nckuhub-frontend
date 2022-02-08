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
    public query: string = "";
    public isDropdownOpen: Boolean=false;
    private allCourseInNewSemester: CourseModel[] = [];
    displayCourseList: CourseModel[] = [];
    result:CourseModel[] = [];
    MAX_COURSE_DISPLAY_NUM = 200;
    public search:  any = '';

    constructor(
        private router: Router,
        private courseService: CourseService
    ) {}

    ngOnInit(): void {
        // this.href = this.router.url;
        this.getCourseData();
        
    }

    /**
     *  打API拿 完整課程資料，取出部分初始化 展示用課程資料 和 有評論的課程資料
     */
     private getCourseData(): void {
        // 加filter是因為可能會收到空陣列
        this.courseService.getCourseData().pipe(filter(data => data.length !== 0), take(1)).subscribe(
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
 /**
     * 回傳 傳入課程 的所屬系所簡稱
     * @param deptID 傳入課程的系所代號
     * @param deptName 傳入課程的系所名稱
     * @returns 傳入課程的所屬系所簡稱
     */
  deptTransCat(deptID: string, deptName: string): string {
    let category: string;
    switch (deptID) {
        case 'A9':
            category = '通';
            break;
        case 'A6':
            category = '服';
            break;
        case 'A7':
            category = '國';
            break;
        case 'A1':
            category = '外';
            break;
        case 'A2':
            category = '體';
            break;
        default:
            category = deptName.substring(0, 1);
    }
    return category;
}

    ngOnChanges():void{
        console.log(this.query)
    }
    // UpdateSearchCourseList():void{
    //     // this.searchCourseList = this.displayCourseList;
    //     console.log("this.result.length:",this.result.length);
    //     console.log(this.result)
    // }


}
