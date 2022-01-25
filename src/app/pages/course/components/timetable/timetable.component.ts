import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { TimetableService, TableCellData } from '../../services/timetable.service';
import { CourseModel } from '../../models/Course.model';
import { Subscription } from 'rxjs';

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
    creditsSubscription: Subscription;
    photoURL: string = "../../../../../assets/images/course/sad_hugecat.png";
    userName: string = "Hello World";

    searchBarTitle: string = "快速添加";
    keyword = "";
    courseSearchResult: CourseModel[] = [];

    constructor(private timetableService: TimetableService) { }

    ngOnInit(): void {
        // TODO: ecfack 從timetableServicec 獲取 展示版課表 和使用者課表
        this.tempTable = this.timetableService.tempTable;
        this.coursesOnWorkdays = this.timetableService.coursesOnWorkdays;
        this.coursesOnOtherDays = this.timetableService.coursesOnOtherDays;
        this.getData();
    }

    ngOnDestroy(): void {
        this.creditsSubscription.unsubscribe();
    }

    private getData(): void {
        this.creditsSubscription = this.timetableService.getCredits().subscribe(
            (credits) => {
                this.credits = credits;
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
     * TODO: ecfack 從課表 移除 特定課程
     * @param courseId 特定課程的Id
     */
    deleteItem(courseId: number): void {
        this.timetableService.deleteItem(courseId);
    }

    clearFilter(): void {
        // if ( this.isFiltering ) {
        //     this.filterMode( "off" );
        //     vue_classtable.clearFilterCell();
        //     vue_wishlist.clearFilter();
        // }
    }

    /**
     * 處理 keyup event，目前用於處理 compositionend event 吃不到 Backspace鍵的情況
     * @param e 篩選系別的搜尋欄event
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
     * 依據關鍵字 列出可能的系所 或 關閉並清除 篩選系所狀態
     */
    @HostListener('compositionend', ['$event.target.value'])
    searchCourse(keyword: string): void {
        this.keyword.replace(/\s+/g, '');
        const textToFind = this.formatKeyword(this.keyword);
        if (textToFind) {
            let courseName: string, teacher: string, matchResult1: RegExpMatchArray | null, matchResult2: RegExpMatchArray | null;
            this.courseSearchResult = this.timetableService.allCourseInNewSemester.filter((course) => {
                courseName = this.formatKeyword(course.courseName);
                teacher = this.formatKeyword(course.teacher);
                matchResult1 = courseName.match(textToFind);
                matchResult2 = teacher.match(textToFind);
                return matchResult1 || matchResult2;
            });
        }
    }

    // 文字處理：排除正規表達式的的特殊符號
    getREValidText(text: string): string {
        const invalid = /[()\[\]{}]+/g;
        if (text.match(invalid)) {
            text = text.replace(invalid, "");
            return text;
        }
        // else {
        //     return 0;
        // }
        return text;
    }


    // 搜尋功能：輸入關鍵字、搜尋範圍、輸出陣列
    formatKeyword(text: string): string {
        // 預先排除特殊符號、大小寫因素
        text = this.getREValidText(text);
        text = text.toString().toUpperCase();
        return text;
    }

    onRefreshKeyword(refreshedKeyword: string) {
        this.keyword = refreshedKeyword;
    }
}