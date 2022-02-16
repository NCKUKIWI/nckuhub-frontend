import { Component, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CourseRateModel } from '../../models/CourseRate.model';
import { HistoryCourseModel } from '../../models/Course.model';
import { CourseFormModel } from '../../models/CourseForm.model';
import { CourseService } from '../../services/course.service';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
    selector: 'app-write-comment',
    templateUrl: './write-comment.component.html',
    styleUrls: ['./write-comment.component.scss'],
})
export class WriteCommentComponent implements OnInit {
    constructor(
        private courseService: CourseService,
        private fb: FormBuilder,
        @Optional()
        public ref: DynamicDialogRef,
        private http: HttpClient
    ) {}

    // 課程心得表單(For post)
    courseForm: FormGroup;
    // 監督課程名稱及課程心得的表單
    courseCommentForm: FormGroup;
    // 存取所有課程以便searchCourseTitle搜尋可能的課程列表
    courseData: string[] = [];
    // 可能的課程列表
    courseTitleSuggestion: string[] = [];
    // 紀錄最終選擇的課程
    courseTitleFilled: string;
    // 利用選擇的課程抓取到的過去資料
    historyCourseData: HistoryCourseModel[] = [];
    // 紀錄最終選擇的開課學期
    courseSemester: string = '選擇學期';
    // 是否選擇開課學期這個欄位
    isChoosingSemester: boolean = false;
    // 該課程可能的開課學期
    courseSemesterSuggestion: string[] = [];
    // 紀錄最終選擇的開課教師
    courseTeacher: string = '選擇開課教師';
    // 是否選擇開課教師這個欄位
    isChoosingTeacher: boolean = false;
    // 該課程可能的開課教師
    courseTeacherSuggestion: string[] = [];
    // 紀錄最終選擇的開課系所
    courseDept = '';
    // 紀錄課程評分
    courseRate: CourseRateModel = {
        gain: 5,
        sweet: 5,
        cold: 5,
    };
    // 填心得能獲得的點數(目前是設定給3點)
    coursePoint: number;
    // 控制底下的div顯示的字
    writeCommentStatus: string = '心得最低需求 50 字，請填寫完畢後按下送出。';
    // 控制是否放棄課程心得的div
    commentGiveUp: boolean = false;
    // 檢查字數是否超過50字
    passValidator: boolean = false;
    // 課程心得已成功送出
    commentSend: boolean = false;

    ngOnInit(): void {
        // 創建課程心得表單
        this.createCourseCommentForm();
        // 取得所有課程名稱
        this.getCourseData();
        // 監聽courseTitle以呈現可能的課程列表
        this.searchCourseTitle();
    }

    /**
     * 創建課程心得表單
     */
    private createCourseCommentForm(): void {
        this.courseCommentForm = this.fb.group({
            // 和輸入課程欄位互相響應
            courseTitle: '',
            // 和輸入心得欄位互相響應
            courseComment: { value: '', disabled: true },
        });
    }

    /**
     * 創建課程表單 (For post)
     */
    private createPostForm(): void {
        this.courseForm = this.fb.group({
            course_name: this.courseTitleFilled,
            teacher: this.courseTeacher,
            semester: this.courseSemester,
            catalog: this.courseDept,
            comment: this.courseCommentForm.get('courseComment').value,
            sweet: this.courseRate.sweet,
            cold: this.courseRate.cold,
            got: this.courseRate.gain,
            point: this.coursePoint,
        });
    }

    /**
     * 取得所有課程名稱
     */
    private getCourseData(): void {
        this.courseService.getHistoryCourseModel().subscribe((courseAllData) => {
            courseAllData.forEach((course) => {
                // 避免相同課程被重複篩選
                if (this.courseData.indexOf(course.courseName) === -1) {
                    this.courseData.push(course.courseName);
                }
            });
        });
    }

    /**
     * 取得該課程有開課的學期及開課教師
     * @param courseTitleFilled
     */
    private getHistoryCourseData(courseTitle: string): void {
        this.courseService.getCourseByCourseName(courseTitle).subscribe((courseData) => {
            this.historyCourseData = courseData;
            // 篩選該課程有開課的學期
            this.getCourseSemester();
        });
    }

    /**
     * 篩選該課程有開課的學期
     */
    private getCourseSemester(): void {
        this.historyCourseData.forEach((course) => {
            if (this.courseSemesterSuggestion.indexOf(course.semester) === -1) {
                this.courseSemesterSuggestion.push(course.semester);
            }
        });
    }

    /**
     * 篩選特定學期有開該課程的教師
     * @param courseSemester
     */
    private getCourseTeacher(courseSemester: string): void {
        this.historyCourseData.forEach((course) => {
            if (course.semester === courseSemester && this.courseTeacherSuggestion.indexOf(this.getREValidText(course.teacher)) === -1) {
                this.courseTeacherSuggestion.push(this.getREValidText(course.teacher));
            }
        });
    }

    /**
     * 找出開該課程的系所
     * @param courseSemester & courseTeacher
     *
     */
    private getCourseDept(courseSemester: string, courseTeacher: string): void {
        this.historyCourseData.forEach((course) => {
            if (course.semester === courseSemester && course.teacher === courseTeacher) {
                this.courseDept = course.deptId;
            }
        });
    }

    /**
     * 刪除不必要的字元，如果是英文統一轉換為大寫的格式
     * @param text
     */
    private getREValidText(text: string): string {
        var invalid = /^\s*|\s*$/g;
        if (text.match(invalid)) {
            text = text.replace(invalid, '');
            text = text.replace('*', '');
            return text.toUpperCase();
        }
        return text.toUpperCase();
    }

    /**
     * 尋找可能的課程清單
     */
    private searchCourseTitle(): void {
        this.courseCommentForm.get('courseTitle').valueChanges.subscribe((enterTitle: string) => {
            // 將input的資料整理
            enterTitle = this.getREValidText(enterTitle);
            // 清空可能課程的陣列及取消學期及老師的dropdown
            this.clearComment();
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
     * 清空所有留言資料
     */
    private clearComment(): void {
        // 清空可能課程的陣列
        this.courseTitleSuggestion = [];
        this.courseTitleFilled = '';
        // 清空選擇學期的dropdown及欄位
        this.isChoosingSemester = false;
        this.courseSemester = '選擇學期';
        this.courseSemesterSuggestion = [];
        // 清空選擇教師的dropdown及欄位
        this.isChoosingTeacher = false;
        this.courseTeacher = '選擇開課教師';
        this.courseTeacherSuggestion = [];
        this.courseCommentForm.get('courseComment').setValue('');
        // 鎖定課程心得欄位
        this.courseCommentForm.get('courseComment').disable();
        // 清空評分紀錄
        this.courseRateInit();
        // 清空給予的點數
        this.coursePoint = 0;
    }
    /*
     * 將點選的課程名稱填入，並清空courseTitleSuggestion
     * @param title  課程名稱
     */
    private fillTitle(title: string): void {
        // 重新監聽CourseTitle這欄
        this.courseCommentForm.get('courseTitle').setValue(title);
        this.searchCourseTitle();
        // 將選擇的課程放入courseTitleFilled
        this.courseTitleFilled = title;
        // 清空可能的課程列表
        this.courseTitleSuggestion = [];
        // 利用課程名稱搜尋其可能的開課學期及教師
        this.getHistoryCourseData(title);
    }

    /**
     * 選擇開課學期這個欄位，並展開dropdown
     */
    private chooseSemester(): void {
        this.isChoosingSemester = true;
        this.isChoosingTeacher = false;
    }

    /**
     * 將點選的課程名稱填入，並清空courseTitleSuggestion
     * @param semester 開課學期
     */
    private fillSemester(semester: string): void {
        // 填入開課學期欄位並關閉dropdown
        this.courseSemester = semester;
        this.isChoosingSemester = false;
        // 清空開課教師的欄位並重新搜尋該學期可能的開課教師
        this.courseTeacher = '選擇開課教師';
        this.courseTeacherSuggestion = [];
        this.getCourseTeacher(semester);
    }

    /**
     * 選擇開課教師這個欄位，並展開dropdown
     */
    private chooseTeacher(): void {
        this.isChoosingSemester = false;
        this.isChoosingTeacher = true;
    }

    /**
     * 將點選的課程名稱填入，並清空courseTitleSuggestion
     * @param semester 開課學期
     */
    private fillTeacher(teacher: string): void {
        // 填入開課學期欄位並關閉dropdown
        this.courseTeacher = teacher;
        this.isChoosingTeacher = false;
        // 搜尋開課的系所
        this.getCourseDept(this.courseSemester, this.courseTeacher);
        // 給予填寫心得的點數
        this.coursePoint = 3;
        // 使下方填寫心得欄位可以使用並隨時檢查心得字數是否達到50字
        this.courseCommentForm.get('courseComment').enable();
        this.courseCommentValidator();
    }

    /**
     * 控制下方div的提示
     * @param command
     */
    private changeStatus(command: string): void {
        if (command === 'gain') {
            this.writeCommentStatus = '可填 1-10 分，高分表示該課程「上課收穫很多」。';
        }
        if (command === 'sweet') {
            this.writeCommentStatus = '可填 1-10 分，高分表示該課程「上課給分較高」。';
        }
        if (command === 'cold') {
            this.writeCommentStatus = '可填 1-10 分，高分表示該課程「上課較為輕鬆」。';
        }
        if (command === 'default') {
            this.writeCommentStatus = '心得最低需求 50 字，請填寫完畢後按下送出。';
        }
    }

    /**
     * 初始化courseRate的值
     */
    private courseRateInit(): void {
        this.courseRate.gain = 5;
        this.courseRate.sweet = 5;
        this.courseRate.cold = 5;
    }

    /**
     * 更改課程評分(需精簡整個code)
     * @param index:string 評分項目/ num:number 分數加或減(1 or -1)
     */
    private giveRate(index: string, num: number): void {
        if (index === 'gain') {
            this.courseRate.gain = this.courseRateCalc(this.courseRate.gain + num);
        }
        if (index === 'sweet') {
            this.courseRate.sweet = this.courseRateCalc(this.courseRate.sweet + num);
        }
        if (index === 'cold') {
            this.courseRate.cold = this.courseRateCalc(this.courseRate.cold + num);
        }
    }

    /**
     * 課程評分控制在1~10
     * @param rate:number 計算後的分數
     */
    private courseRateCalc(rate: number): number {
        if (rate > 10) {
            return 10;
        }
        if (rate < 1) {
            return 1;
        }
        return rate;
    }

    /**
     * 檢查課程心得留言是否有50字以上
     */
    private courseCommentValidator(): void {
        this.courseCommentForm.get('courseComment').valueChanges.subscribe((comment: string) => {
            // 將comment過濾特殊符號
            let validComment = this.getREValidText(comment);
            // 檢查是否已滿足50字的條件
            if (validComment.length >= 50) {
                this.passValidator = true;
            } else {
                this.passValidator = false;
            }
        });
    }

    /**
     * 打包留言並送出
     */
    private sendComment(): void {
        if (this.passValidator) {
            // 創建courseForm(For post)
            this.createPostForm();
            // post request
            let options = {
                headers: new HttpHeaders({ 'Content-Type': 'multipart/form-data' }),
            };
            this.http.post<CourseFormModel>('https://nckuhub.com/post/create', this.courseForm.value, options).subscribe(
                (res) => {
                    // 展開訊息已成功送出div(移到post裡面)
                    this.commentSend = true;
                    console.log(res);
                },
                (err: any) => {
                    console.log('送出心得: ' + err);
                }
            );
        }
    }

    /**
     * 放棄留言並關閉新增評論
     */
    private giveUpComment(): void {
        if (this.courseCommentForm.get('courseComment').value.length > 0 && !this.commentGiveUp) {
            this.commentGiveUp = true;
        } else {
            this.backToHomePage();
        }
    }

    /**
     * 關閉提示放棄留言的div
     */
    private closeWindow(): void {
        this.commentGiveUp = false;
    }

    /**
     * 關閉填寫課程心得的dialog並回到首頁
     */
    private backToHomePage(): void {
        this.commentSend = false;
        this.ref.close();
    }

    /**
     * 再填寫一份留言
     */
    private oneMoreComment(): void {
        this.commentSend = false;
        // 重新監聽CourseTitle這欄
        this.courseCommentForm.get('courseTitle').setValue('');
        this.searchCourseTitle();
        // 清空所有留言格
        this.clearComment();
    }
}
