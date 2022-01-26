import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { TimetableService } from '../../services/timetable.service';
import { CourseService } from '../../services/course.service';
import { TableCellData } from '../../models/Timetable.model';
import { CourseModel } from '../../models/Course.model';
import { Subscription } from 'rxjs';
import { filter, take } from 'rxjs/operators';

@Component({
    selector: 'app-timetable',
    templateUrl: './timetable.component.html',
    styleUrls: ['./timetable.component.scss'],
})
export class TimetableComponent implements OnInit, OnDestroy {

    // 當前課表 是否 鎖定
    isLocked = false;
    isFiltering = false;

    // 暫時的使用者課表
    tempTable: number[];
    // 平日時段的 展示版課表
    coursesOnWorkdays: TableCellData[][];
    // 非平日時段的 展示版課表
    coursesOnOtherDays: CourseModel[];

    credits: number = 0;
    timetableInfoSubscription: Subscription;
    photoURL: string = "../../../../../assets/images/course/sad_hugecat.png";
    userName: string = "Hello World";

    // 完整的本學期課程
    allCourseInNewSemester: CourseModel[] = [];

    searchBarTitle: string = "快速添加";
    keyword = "";
    courseSearchResult: CourseModel[] = [];

    constructor(private timetableService: TimetableService, private courseService: CourseService) { }

    ngOnInit(): void {
        // 從courseService 獲取 本學期的 所有課程
        this.getCourseData();
        // 從timetableServicec 獲取 展示版課表 和使用者課表
        this.getTimetableData();
    }

    ngOnDestroy(): void {
        // 取消訂閱 最新的課表相關資訊
        this.timetableInfoSubscription.unsubscribe();
    }

    /**
     *  打API拿 完整課程資料
     */
    private getCourseData(): void {
        // 加filter是因為可能會收到空陣列
        this.courseService.getCourseData().pipe(filter(data => data.length !== 0), take(1)).subscribe(
            (courseData) => {
                this.allCourseInNewSemester = courseData;
            },
            (err: any) => {
                if (err) {
                    console.error(err);
                }
            }
        );
    }

    /**
     * 隨時獲取 最新的課表相關資訊
     */
    private getTimetableData(): void {
        this.timetableInfoSubscription = this.timetableService.getTimetableInfo().subscribe(
            (info) => {
                this.credits = info.credits;
                this.tempTable = info.tempUserTable;
                this.coursesOnWorkdays = info.displayedTableWorkdays;
                this.coursesOnOtherDays = info.displayedTableOtherDays;
            },
            (err: any) => {
                if (err) {
                    console.error(err);
                }
            }
        );
    }

    /**
     * TODO: ecfack 切換 課表的鎖定狀態
     */
    switchToEdit(): void {
        this.isLocked = !this.isLocked;
        // vue_fixed_button.switchLockStatus();
    }

    /**
     * 從使用者課表 移除 特定課程
     * @param courseId 特定課程的Id
     */
    deleteItem(course: CourseModel): void {
        this.timetableService.removeFromTempUserTable(course);
    }
    
    /**
     * TODO: ecfack 取消時間篩選
     */
    clearFilter(): void {
        // if ( this.isFiltering ) {
        //     this.filterMode( "off" );
        //     vue_classtable.clearFilterCell();
        //     vue_wishlist.clearFilter();
        // }
    }

    /**
     * 處理 keyup event，目前用於處理 compositionend event 吃不到 Backspace鍵的情況
     * @param e 快速搜尋課程的搜尋欄event
     */
    @HostListener('keydown', ['$event'])
    keyEventHandler(e: KeyboardEvent): void {
        // 純綁compositionend 會吃不到 Backaspace
        if (e.key === 'Backspace') {
            const keyword = (e.target as HTMLInputElement).value;
            this.searchCourse(keyword.slice(0, keyword.length - 1));
            // console.log("split", keyword);
        }
    }

    /**
     * 依據關鍵字 列出可能的課程
     * @param keyword 關鍵字
     */
    @HostListener('compositionend', ['$event.target.value'])
    searchCourse(keyword: string): void {
        this.keyword.replace(/\s+/g, '');
        const textToFind = this.formatKeyword(this.keyword);
        if (textToFind) {
            // 被比對的 課程資訊
            let courseName: string, teacher: string;
            // 比對後的結果
            let matchResult1: RegExpMatchArray | null, matchResult2: RegExpMatchArray | null;

            // 篩選出 「課程名稱 含關鍵字 或 老師名稱 含關鍵字」的課程
            this.courseSearchResult = this.allCourseInNewSemester.filter((course) => {
                courseName = this.formatKeyword(course.courseName);
                teacher = this.formatKeyword(course.teacher);

                matchResult1 = courseName.match(textToFind);
                matchResult2 = teacher.match(textToFind);
                return matchResult1 || matchResult2;
            });
        }
    }

    /**
     * 文字處理：排除正規表達式的的特殊符號
     * @param text 欠處理的字串
     * @returns 處理後的字串
     */
    getREValidText(text: string): string {
        const invalid = /[()\[\]{}]+/g;
        if (text.match(invalid)) {
            text = text.replace(invalid, "");
            return text;
        }
        return text;
    }


    /**
     * 將字串 去除特殊符號 和 轉成大寫
     * @param text 欠處理的字串
     * @returns 處理後的字串
     */
    formatKeyword(text: string): string {
        // 預先排除特殊符號、大小寫因素
        text = this.getREValidText(text);
        text = text.toString().toUpperCase();
        return text;
    }

    /**
     * 接收 子元件 發出的 更動字串請求
     * @param refreshedKeyword 更動後的字串
     */
    onRefreshKeyword(refreshedKeyword: string) {
        this.keyword = refreshedKeyword;
    }
}