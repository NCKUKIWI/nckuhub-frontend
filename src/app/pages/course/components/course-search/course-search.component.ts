import { AfterViewInit, Component, HostListener, OnInit } from '@angular/core';
import { CourseService } from '../../services/course.service';
import { CourseModel } from '../../models/Course.model';
import { DepartmentModel } from '../../models/Department.model';
import { filter, take } from 'rxjs/operators';
import { WishListService } from '../../services/wish-list.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Router } from '@angular/router';
import { CourseContentComponent } from '../course-content/course-content.component';
import { WriteCommentComponent } from '../write-comment/write-comment.component';

@Component({
    selector: 'app-course-search',
    templateUrl: './course-search.component.html',
    styleUrls: ['./course-search.component.scss'],
})
export class CourseSearchComponent implements OnInit, AfterViewInit {
    constructor(private courseService: CourseService, private dialogService: DialogService, private wishListService: WishListService, private router: Router) {}

    // 完整的本學期課程
    allCourseInNewSemester: CourseModel[] = [];
    // 部分的本學期課程，用於展示在課程列表
    displayCourseList: CourseModel[] = [];

    // 展示用課程的起始筆數 (for 非篩選的資料使用)
    MAX_COURSE_DISPLAY_NUM = 200;
    // 無限下拉 每次增加筆數
    SCROLL_ADD_NUM = 20;
    // 監聽 當下拉到end會觸發無限下拉
    scrollEndListener: IntersectionObserver;

    // 有評論的所有課程
    allCourseListWithComment: CourseModel[] = [];
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
    allCourseListWithDept: CourseModel[] = [];
    // 最近一次 經過系所篩選 的系所代號
    keyPrefix = '';
    // DynamicDialog的參數
    ref: DynamicDialogRef;

    mobile_status: 'default';

    ngOnInit(): void {
        // 取得 所有課程資料，初始化 展示用課程資料 和 有評論的課程資料
        this.getCourseData();
        // 取得 所有系所資料
        this.getDeptData();
    }

    ngAfterViewInit(): void {
        // 監聽 無限下拉 功能
        this.setInfiniteScroll();
    }

    /**
     *  打API拿 完整課程資料，取出部分初始化 展示用課程資料 和 有評論的課程資料
     */
    private getCourseData(): void {
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
                    this.allCourseListWithComment = this.allCourseInNewSemester.filter((course) => course.commentNum > 0);
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
     * 打API拿 所有系所資料
     */
    private getDeptData(): void {
        this.courseService
            .fetchDepartments()
            .pipe(take(1))
            .subscribe(
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

    /**
     * 解除 課程篩選狀態，依據評論篩選狀態 初始化 當前要展示的課程列表
     */
    private deleteSearch(): void {
        this.keyword = '';
        this.isDeptOnly = false;
        // 如果 有開啟 評論篩選功能
        if (this.isCommentOnly === true) {
            this.displayCourseList = this.allCourseListWithComment;
        } else {
            this.displayCourseList = this.allCourseInNewSemester.slice(0, this.MAX_COURSE_DISPLAY_NUM);
        }
    }

    /**
     * 處理 每次開關評論篩選，選擇 所需展示的課程資料
     */
    private commentFilter(): void {
        const cCheck = document.getElementById('commentCheck') as HTMLInputElement;
        // 如果 有開啟 評論篩選功能
        if (cCheck.checked === true) {
            this.isCommentOnly = true;

            // 如果 有開啟 系所篩選功能
            if (this.isDeptOnly === true) {
                this.displayCourseList = this.allCourseListWithDept.filter((course) => course.commentNum > 0);
            } else {
                this.displayCourseList = this.allCourseListWithComment;
            }
        } else {
            this.isCommentOnly = false;

            // 如果 有開啟 系所篩選功能
            if (this.isDeptOnly === true) {
                this.displayCourseList = this.allCourseListWithDept;
            } else {
                this.displayCourseList = this.allCourseInNewSemester.slice(0, this.MAX_COURSE_DISPLAY_NUM);
            }
            // console.log(this.course_data.length);
        }
    }

    /**
     * 處理 keyup event，目前用於處理 compositionend event 吃不到 Backspace鍵的情況
     * @param e 篩選系別的搜尋欄event
     */
    @HostListener('keydown', ['$event'])
    private keyEventHandler(e: KeyboardEvent): void {
        // 純綁compositionend 會吃不到 Backaspace
        if (e.key === 'Backspace') {
            const keyword = (e.target as HTMLInputElement).value;
            this.searchDept(keyword.slice(0, keyword.length - 1));
            // console.log("split", keyword);
        }
    }

    /**
     * 依據關鍵字 列出可能的系所 或 關閉並清除 篩選系所狀態
     */
    @HostListener('compositionend', ['$event.target.value'])
    private searchDept(keyword: string): void {
        // this.keyword = this.keyword.trim();
        this.keyword = keyword.trim();
        this.deptSearchResult = [];
        if (this.keyword === '') {
            this.deleteSearch();
        } else {
            // 顯現 所有可能搜尋結果
            const dropdownElement = document.getElementsByClassName('quick_search_dropdown--course');
            // 這個判斷式是因為不知為啥會出現 找不到的情況
            if (dropdownElement.length > 0) {
                (dropdownElement[0] as HTMLElement).style.visibility = 'visible';
            }
            // console.log("keyword:" + keyword, keyword.length)
            // 關鍵字可能是系號
            this.keyword = this.keyword.toUpperCase();
            for (const i in this.dept) {
                if (this.dept[i].DepPrefix.match(this.keyword) || this.dept[i].DepName.match(this.keyword)) {
                    const result_candidate = Object.assign({}, this.dept[i]);
                    this.deptSearchResult.push(result_candidate);
                }
            }

            // 此時課程列表 顯示 上次搜尋結果，如果未曾執行過搜尋，無限下拉會幫忙塞課程
            // 如果 曾搜尋系所
            if (this.keyPrefix !== '') {
                // 如果 有開啟評論篩選功能
                if (this.isCommentOnly === true) {
                    this.displayCourseList = this.allCourseListWithComment.filter((course) => course.deptId === this.keyPrefix);
                } else {
                    this.displayCourseList = this.allCourseInNewSemester.filter((course) => course.deptId === this.keyPrefix);
                }
            }
            // console.log("keyprefix",this.displayCourseList.length)
        }
    }

    /**
     * 使用者 點擊 目標系所後，顯示 目標系所下的課程
     * @param resultPrefix 目標系所的系號
     * @param resultName 目標系所的名稱
     */
    private clickSearchResult(resultPrefix: string, resultName: string): void {
        this.keyword = resultName;
        this.keyPrefix = resultPrefix;

        this.isDeptOnly = true;
        this.allCourseListWithDept = this.allCourseInNewSemester.filter((courses) => courses.deptId === this.keyPrefix);

        // 如果 有開啟 評論篩選功能
        if (this.isCommentOnly === true) {
            this.displayCourseList = this.allCourseListWithDept.filter((course) => course.commentNum > 0);
        } else {
            this.displayCourseList = this.allCourseListWithDept;
        }

        // 隱藏 所有可能的篩選結果
        (document.getElementsByClassName('quick_search_dropdown--course')[0] as HTMLElement).style.visibility = 'hidden';
        // 把選擇的系所名稱 寫回 搜尋欄
        (document.getElementsByClassName('quick_search_input')[0] as HTMLInputElement).value = this.keyword;
    }

    /**
     * 監聽 無限下拉 功能
     * @private
     */
    private setInfiniteScroll(): void {
        // init listener
        this.scrollEndListener = this.initInfiniteScrollAction();
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
                needAddCourse =
                    needAddCourse &&
                    // 無 篩選條件
                    this.isCommentOnly === false &&
                    this.isDeptOnly === false &&
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
                    //   console.log('觸發更新', this.displayCourseList.length, this.allCourseInNewSemester.length);
                }
            },
            { threshold: 0 }
        );
    }

    /**
     * 將特定課程 從願望清單 加入或移出
     * @param courseId 要 加入或移出 願望的課程Id
     */
    private setWish(courseId: number): void {
        if (!this.isInWishList(courseId)) {
            this.addWish(courseId);
        } else {
            this.removeWish(courseId);
        }
    }

    /**
     * 將特定課程 加入 願望清單
     * @param courseId 要 加入 願望的課程Id
     */
    private addWish(courseId: number): void {
        this.wishListService.addWish(courseId);
    }

    /**
     * 將特定課程 移出 願望清單
     * @param courseId 要 移出 願望的課程Id
     */
    private removeWish(courseId: number): void {
        this.wishListService.removeWish(courseId);
    }

    /**
     * 檢測特定課程 是否在 願望清單
     * @param courseId 需檢測 的課程Id
     * @returns false：此課程 不在 願望清單，true：此課程 在 願望清單
     */
    private isInWishList(courseId: number): boolean {
        return this.wishListService.isInWishList(courseId);
    }
}
