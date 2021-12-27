import {AfterViewInit, Component, OnInit} from '@angular/core';
import {CourseService} from '../../services/course.service';
import {CourseModel} from '../../models/Course.model';
import {DepartmentModel} from '../../models/Department.model';

@Component({
    selector: 'app-course-search',
    templateUrl: './course-search.component.html',
    styleUrls: ['./course-search.component.scss'],
})
export class CourseSearchComponent implements OnInit, AfterViewInit {
    constructor(private courseService: CourseService) {}
    // 完整的本學期課程
    allCourseInNewSemester: CourseModel[] = [];
    // 部分的本學期課程，用於展示在課程列表
    displayCourseList: CourseModel[] = [];

    // 展示用課程的起始筆數 (for 非篩選的資料使用)
    MAX_COURSE_DISPLAY_NUM = 200;
    // 無限下拉 每次增加筆數
    SCROLL_ADD_NUM = 20;
    // 監聽 當下拉到end會觸發無限下拉
    scrollEndListener = this.initInfiniteScrollAction();

    // 有評論的所有課程
    wholeCourseListWithComment: CourseModel[] = [];
    // 是否 有開啟評論篩選功能
    isCommentOnly = false;

    // 是否 有開啟系所篩選功能
    isDeptOnly = false;
    // 系所搜尋的關鍵字
    keyword = '';
    // 所有系所
    dept: DepartmentModel[] = [];
    // 經過 關鍵字篩選 出的系所
    deptSearchResult: DepartmentModel[] = [];
    // 最近一次 經過系所篩選 的課程
    wholeCourseListWithDept: CourseModel[] = [];
    // 最近一次 經過系所篩選 的系所代號
    keyPrefix = '';

    mobile_status: 'default';

    ngOnInit(): void {
        // 取得 課程資料
        this.getCourseData();
        // 取得 系所資料
        this.getDeptData();
    }

    ngAfterViewInit(): void {
        // 監聽 無限下拉 功能
        this.setInfiniteScroll();
    }

    /**
     *  打API拿 完整課程資料，取出部分初始化 展示用課程資料 和 有評論的課程資料
     */
    getCourseData(): void {
        this.courseService.getCourseData().subscribe(
            (courseData) => {
                this.allCourseInNewSemester = courseData;
                this.displayCourseList = this.allCourseInNewSemester.slice(0, this.MAX_COURSE_DISPLAY_NUM);
                this.wholeCourseListWithComment = this.allCourseInNewSemester.filter((course) => course.commentNum > 0);
            },
            (err: any) => {
                if (err) {
                    console.error(err);
                }
            }
        );
    }

    /**
     * 打API拿 所有系所資料
     */
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

    /**
     * 為課程 打開課程內頁
     * @param courseId 要打開課程內頁的課程的id
     */
    openCoursePage(courseId: number): void {}

    /**
     * 把課程 加入願望清單
     * @param courseId 要加入願望的課程的id
     */
    setCourse(courseId: number): void {}

    /**
     * 解除 課程篩選狀態，依據評論篩選狀態 初始化 當前要展示的課程列表
     */
    deleteSearch(): void {
        this.keyword = '';
        this.isDeptOnly = false;
        // 如果 有開啟 評論篩選功能
        if (this.isCommentOnly === true) {
            this.displayCourseList = this.wholeCourseListWithComment;
        } else {
            this.displayCourseList = this.allCourseInNewSemester.slice(0,this.MAX_COURSE_DISPLAY_NUM);
        }
    }

    /**
     * 處理 每次開關評論篩選，選擇 所需展示的課程資料
     */
    comment_filter(): void {
        const cCheck = document.getElementById('commentCheck') as HTMLInputElement;
        // 如果 有開啟 評論篩選功能
        if (cCheck.checked === true) {
            this.isCommentOnly = true;
            
            // 如果 有開啟 系所篩選功能
            if (this.isDeptOnly === true) {
                this.displayCourseList = this.wholeCourseListWithDept.filter((course) => course.commentNum > 0);
            } else {
                this.displayCourseList = this.wholeCourseListWithComment;
            }
        } else {
            this.isCommentOnly = false;

            // 如果 有開啟 系所篩選功能
            if (this.isDeptOnly === true) {
                this.displayCourseList = this.wholeCourseListWithDept;
            } else {
                this.displayCourseList = this.allCourseInNewSemester.slice(0, this.MAX_COURSE_DISPLAY_NUM);
            }
            // console.log(this.course_data.length);
        }
    }

    /**
     * 依據關鍵字 列出可能的系所 或 關閉並清除 篩選系所狀態
     */
    searchDept(keyword:string): void {
        // this.keyword = this.keyword.trim();
        this.keyword = keyword.trim();
        this.deptSearchResult = [];
        if (this.keyword === '') {
            this.deleteSearch();
        }
        else {
            // 關鍵字可能是系號
            console.log("keyword:"+this.keyword)
            this.keyword = this.keyword.toUpperCase();
            for (const i in this.dept) {
                if (this.dept[i].DepPrefix.match(this.keyword) || this.dept[i].DepName.match(this.keyword)) {
                    const result_candidate = Object.assign({}, this.dept[i]);
                    this.deptSearchResult.push(result_candidate);
                }
            }

            // 此時課程列表 顯示 上次搜尋結果
            // 如果 有開啟評論篩選功能
            if (this.isCommentOnly === true) {
                this.displayCourseList = this.wholeCourseListWithComment.filter((course) => course.deptId === this.keyPrefix);
            } else {
                this.displayCourseList = this.allCourseInNewSemester.filter((course) => course.deptId === this.keyPrefix);
            }
        }
    }

    /**
     * 使用者 點擊 目標系所後，顯示 目標系所下的課程
     * @param resultPrefix 目標系所的系號
     * @param resultName 目標系所的名稱
     */
    result_click(resultPrefix: string, resultName: string): void {
        this.keyword = resultName;
        this.keyPrefix = resultPrefix;

        this.isDeptOnly = true;
        this.wholeCourseListWithDept = this.allCourseInNewSemester.filter((courses) => courses.deptId === this.keyPrefix);

        // 如果 有開啟 評論篩選功能
        if (this.isCommentOnly === true) {
            this.displayCourseList = this.wholeCourseListWithDept.filter((course) => course.commentNum>0);
        } else {
            this.displayCourseList = this.wholeCourseListWithDept;
        }

        // 關閉 可能的篩選結果
        // this.deptSearchResult=[]
        (document.getElementsByClassName('quick_search_dropdown--course')[0] as HTMLElement).style.display = 'none';
    }

    /**
     * 監聽 無限下拉 功能
     * @private
     */
    private setInfiniteScroll(): void{
        // 取得 顯示課程列表 最尾巴物件
        const scrollEndTargetElement = document.querySelector('.course_data_end');
        // 綁上監聽
        this.scrollEndListener.observe(scrollEndTargetElement);
    }

    /**
     * 下拉到EndTarget action
     * @private
     */
    private initInfiniteScrollAction(): IntersectionObserver {
        return new IntersectionObserver(
          (entries, observer) => {
              let needAddCourse = true;
              // 是否要 插入課程
              needAddCourse = needAddCourse &&
                // 無 篩選條件
                (this.isCommentOnly === false && this.isDeptOnly === false) &&
                // 未 塞完所有課程
                this.displayCourseList.length < this.allCourseInNewSemester.length;

              if (needAddCourse) {
                  // 從完整的課程資料 最多抽出 接下來的20筆新資料
                  // 新的展示課程資料 <= 完整的課程資料

                  // 下一個插入的end index
                  const nextEndIndex = Math.min(this.allCourseInNewSemester.length, this.displayCourseList.length + this.SCROLL_ADD_NUM);
                  // 接下來的需插入課程 from raw data
                  const nextCourseList = this.allCourseInNewSemester.slice(this.displayCourseList.length, nextEndIndex);
                  this.displayCourseList = this.displayCourseList.concat(nextCourseList);
                  console.log('觸發更新', this.displayCourseList.length, this.allCourseInNewSemester.length);
              }
          },
          { threshold: 0 }
        );
    }
}
