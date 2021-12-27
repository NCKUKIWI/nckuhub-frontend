import {Component, HostListener, OnInit} from '@angular/core';
import {CourseService} from '../../services/course.service';
import {CourseModel} from '../../models/Course.model';
import {DepartmentModel} from '../../models/Department.model';

@Component({
    selector: 'app-course-search',
    templateUrl: './course-search.component.html',
    styleUrls: ['./course-search.component.scss'],
})
export class CourseSearchComponent implements OnInit {
    constructor(private courseService: CourseService) {}
    // 完整的本學期課程
    course_data_db: CourseModel[] = [];
    // 部分的本學期課程，用於展示在課程列表
    displayCourseList: CourseModel[] = [];
    // 課程 顯示最大筆數 (for 非篩選的資料使用)
    maxCourseLength = 200;
    // 無限下拉 每次增加筆數
    scrollAddCourseLength = 20;


    course_with_comment: CourseModel[] = [];

    comment_only = false;
    filter_with_dpmt = false;
    count_height = 1;
    count_index = 0;

    keyword = '';
    dept: DepartmentModel[] = [];
    dept_dropdown: DepartmentModel[] = [];
    filter_by_dpmt: CourseModel[] = [];
    keyPrefix = '';

    mobile_status: 'default';

    private observer = new IntersectionObserver(
        (entries, observer) => {
            if (this.comment_only === false && this.filter_with_dpmt === false) {
                if (this.displayCourseList.length < this.course_data_db.length) {
                    this.displayCourseList = this.displayCourseList.concat(
                        // (新的course_data=目前的course_data+20筆新資料)<=course_data_db
                        this.course_data_db.slice(this.displayCourseList.length, Math.min(this.course_data_db.length, this.displayCourseList.length + this.scrollAddCourseLength))
                    );
                    console.log('觸發更新', this.displayCourseList.length, this.course_data_db.length);
                }
            }
        },
        { threshold: 0 }
    );
    private target: Element | null = null;

    ngOnInit(): void {
        // 取得 課程資料
        this.getCourseData();
        // 取得 系所資料
        this.getDeptData();
        // 監聽 IntersectionObserver 事件
        setTimeout(() => {
            this.target = document.querySelector('.course_data_end');
            if (this.target) {
                this.observer.observe(this.target);
            }
        }, 0);
    }

    // 打API拿course_data
    getCourseData(): void {
        this.courseService.getCourseData().subscribe(
            (courseData) => {
                this.course_data_db = courseData;
                this.displayCourseList = this.course_data_db.slice(0, this.maxCourseLength);
                this.course_with_comment = this.course_data_db.filter((course) => course.comment_num > 0);
            },
            (err: any) => {
                if (err) {
                    console.error(err);
                }
            }
        );
    }

    getDeptData(): void {
        this.courseService.fetchDepartments().subscribe(
            (Departments) => {
                this.dept = Departments;
                console.log('get dept data', Departments.length);
            },
            (err: any) => {
                if (err) {
                    console.error(err);
                }
            }
        );
    }

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

    openCoursePage(courseId: number): void {}

    setCourse(courseId: number): void {}

    deleteSearch(): void {
        this.keyword = '';
        this.filter_with_dpmt = false;
        if (this.comment_only === true) {
            this.displayCourseList = this.course_with_comment;
        } else {
            this.displayCourseList = [];
            for (let i = 0; i < 200; ++i) {
                this.displayCourseList.push(this.course_data_db[i]);
            }
        }
    }

    comment_filter(): void {
        // angular material
        const cCheck = document.getElementById('commentCheck') as HTMLInputElement;
        if (cCheck.checked === true) {
            this.comment_only = true;

            if (this.filter_with_dpmt === true) {
                this.displayCourseList = this.filter_by_dpmt.filter((course) => course.comment_num > 0);
            } else {
                this.displayCourseList = this.course_with_comment;
            }
        } else {
            this.comment_only = false;

            if (this.filter_with_dpmt === true) {
                this.displayCourseList = this.filter_by_dpmt;
            } else {
                this.displayCourseList = this.course_data_db.slice(0, 200);
                // for (let i = 0; i < 200; ++i) {
                //     this.course_data.push(this.course_data_db[i]);
                // }
                // this.count_height = 1;
                // this.count_index = 0;
            }
            // console.log(this.course_data.length);
        }
    }

    searchDept(keyword: string): void {
        this.keyword = keyword.trim();
        // console.log("keyword:"+this.keyword);
        this.dept_dropdown = [];
        if (this.keyword.length < 1) {
            console.log('keyword < 1');
        }
        if (this.keyword !== '') {
            // 自動完成、偵測空值變回全部
            this.keyword = this.keyword.toUpperCase();
            for (const i in this.dept) {
                if (this.dept[i].DepPrefix.match(this.keyword) || this.dept[i].DepName.match(this.keyword)) {
                    const result_candidate = Object.assign({}, this.dept[i]);
                    this.dept_dropdown.push(result_candidate);
                }
            }

            if (this.comment_only === true) {
                // 顯示上次搜尋結果
                this.displayCourseList = this.course_with_comment.filter((course) => course.系號 === this.keyPrefix);
            } else {
                this.displayCourseList = this.course_data_db.filter((course) => course.系號 === this.keyPrefix);
            }
        }
    }

    result_click(resultPrefix: string, resultName: string): void {
        this.keyword = resultName;
        this.keyPrefix = resultPrefix;

        this.filter_with_dpmt = true;
        this.filter_by_dpmt = this.course_data_db.filter((courses) => courses.系號 === this.keyPrefix);

        if (this.comment_only === true) {
            this.displayCourseList = this.course_with_comment.filter((course) => course.系號 === this.keyPrefix);
        } else {
            this.displayCourseList = this.course_data_db.filter((course) => course.系號 === this.keyPrefix);
        }

        // $(".quick_search_dropdown--course").css("display","none");
        (document.getElementsByClassName('quick_search_dropdown--course')[0] as HTMLElement).style.display = 'none';
    }
}
