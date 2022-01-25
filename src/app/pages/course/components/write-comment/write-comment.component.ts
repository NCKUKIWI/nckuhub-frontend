import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { CourseModel } from '../../models/Course.model';
import { CourseRateModel } from '../../models/CourseRate.model';
import { CourseWithCommentModel, CourseComment } from '../../models/CourseComment.model';
import { CourseService } from '../../services/course.service';
// import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
    selector: 'app-write-comment',
    templateUrl: './write-comment.component.html',
    styleUrls: ['./write-comment.component.scss'],
})
export class WriteCommentComponent implements OnInit {
    constructor(private courseService: CourseService) {}

    courseData: string[] = [];
    courseTitle = new FormControl('');
    courseTitleFilled: string = '';
    courseTitleSuggestion: string[] = [];
    courseDeptSuggestion: string[];
    courseDept = '';
    courseIdSuggestion: string[] = [];

    courseSemester: string = '選擇學期';
    isChoosingSemester: boolean = false;
    courseSemesterSuggestion: string[] = [];

    courseTeacher: string = '選擇開課教師';
    isChoosingTeacher: boolean = false;
    courseTeacherSuggestion: string[] = [];

    courseReview: string;
    courseRate: CourseRateModel;
    coursePoint: number;
    writeCommentStatus: string = '心得最低需求 50 字，請填寫完畢後按下送出。';

    // courseForm = new FormGroup ({
    //   courseTitle: new FormControl()
    // });

    ngOnInit(): void {
        // 取得所有課程名稱
        this.getCourseData();
        // 監聽courseTitle以呈現可能的課程列表
        this.searchCourseTitle();
    }

    /**
     * 取得所有課程名稱
     */
    private getCourseData(): void {
        this.courseService.getCourseData().subscribe((courseAllData) => {
            courseAllData.forEach((course) => {
                // 避免相同課程被重複篩選
                if (this.courseData.indexOf(course.courseName) === -1) {
                    this.courseData.push(course.courseName);
                }
            });
        });
    }

    /**
     * 刪除不必要的字元，如果是英文統一轉換為大寫的格式
     * @param text
     */
    private getREValidText(text: string): string {
        var invalid = /[()\[\]{}]+/g;
        if (text.match(invalid)) {
            text = text.replace(invalid, '');
            return text.toUpperCase();
        }
        return text.toUpperCase();
    }

    /**
     * 尋找可能的課程清單
     */
    private searchCourseTitle(): void {
        this.courseTitle.valueChanges.subscribe((enterTitle: string) => {
            // 將input的資料整理
            enterTitle = this.getREValidText(enterTitle);
            // 清空陣列
            this.courseTitleSuggestion = [];
            // 尋找可能的課程名單
            if (enterTitle !== '') {
                this.courseData.forEach((Title) => {
                    const courseTitle = this.getREValidText(Title);
                    if (courseTitle.match(enterTitle)) {
                        this.courseTitleSuggestion.push(Title);
                    }
                });
            }
        });
    }

    /**
     * 將點選的課程名稱填入，並清空courseTitleSuggestion
     * @param title  課程名稱
     */
    private fillTitle(title: string): void {
        this.courseTitleFilled = title;
        this.courseTitleSuggestion = [];
        this.courseTitle = new FormControl(title);
        this.searchCourseTitle();
    }

    /**
     * 關閉提示的dropdowns
     */
    private closeDropdowns(): void {
        this.courseTitleSuggestion = [];
        this.courseTitle = new FormControl('');
        this.searchCourseTitle();
    }

    /**
     * 控制下方div的提示
     * @param command
     */
    private changeStatus(command: string): void {
        if (command == 'gain') {
            this.writeCommentStatus = '可填 1-10 分，高分表示該課程「上課收穫很多」。';
        }
        if (command == 'sweet') {
            this.writeCommentStatus = '可填 1-10 分，高分表示該課程「上課給分較高」。';
        }
        if (command == 'cold') {
            this.writeCommentStatus = '可填 1-10 分，高分表示該課程「上課較為輕鬆」。';
        }
        if (command == 'default') {
            this.writeCommentStatus = '心得最低需求 50 字，請填寫完畢後按下送出。';
        }
    }

    /**
     * 關閉新增評論
     */
    // closeWriteComment(): void {
    //   if (this.ref) {
    //     this.ref.close();
    //   }
    // }
}
