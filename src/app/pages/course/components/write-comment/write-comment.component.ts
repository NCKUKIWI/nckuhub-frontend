import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { map, filter } from 'rxjs/operators';
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
    constructor(private courseService: CourseService, private fb: FormBuilder) {}

    courseForm = this.fb.group({
        // 和輸入課程欄位互相響應
        courseTitle: '',
        // 和輸入心得欄位互相響應
        courseReview: '',
        // 和選擇課程評分互相響應
        // courseRate: this.fb.group({
        //     gain: '',
        //     sweet:'',
        //     cold: '',
        // })
    });

    // 資料送出時打包會需要的(但目前沒用到)
    // courseDeptSuggestion: string[];
    // courseDept = '';
    // courseIdSuggestion: string[] = [];
    // courseId = '';

    // 存取所有課程以便searchCourseTitle搜尋可能的課程列表
    courseData: string[] = [];
    // 可能的課程列表
    courseTitleSuggestion: string[] = [];
    // 紀錄最終選擇的課程
    courseTitleFilled: string;
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
     * 取得該課程有開課的學期(需修改，目前只有抓取到110-2這個學期的課程)
     * @param courseTitleFilled
     */
    private getCourseSemester(courseTitle: string): void {
        this.courseService.getCourseByCourseName(courseTitle).subscribe((courseData) => {
            // courseData.forEach((course) => {
            //     if (this.courseSemesterSuggestion.indexOf(courseData.semester) === -1) {
            //         this.courseData.push(courseData.semester);
            //     }
            //     if (this.courseSemesterSuggestion.indexOf(courseData.teacher) === -1) {
            //         this.courseData.push(courseData.teacher);
            //     }
            // })

            this.courseSemesterSuggestion.push('110-2'); //目前courseModel資料內沒有學期的資料
            this.courseTeacherSuggestion.push(courseData.teacher);
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
        this.courseForm.get('courseTitle').valueChanges.subscribe((enterTitle: string) => {
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
        // 清空留言
        this.courseForm.get('courseReview').setValue('');
        // 清空評分紀錄
        this.courseRateInit();
        // 清空給予的點數
        this.coursePoint = 0;
    }

    /**
     * 將點選的課程名稱填入，並清空courseTitleSuggestion
     * @param title  課程名稱
     */
    private fillTitle(title: string): void {
        // 重新監聽CourseTitle這欄
        this.courseForm.get('courseTitle').setValue(title);
        this.searchCourseTitle();
        // 將選擇的課程放入courseTitleFilled
        this.courseTitleFilled = title;
        // console.log(this.courseTitleFilled);
        // 清空可能的課程列表
        this.courseTitleSuggestion = [];
        // 利用課程名稱搜尋其可能的開課學期及教師
        this.getCourseSemester(title);
    }

    /**
     * 選擇開課學期這個欄位，並展開dropdown
     */
    private chooseSemester(): void {
        this.isChoosingSemester = true;
    }

    /**
     * 將點選的課程名稱填入，並清空courseTitleSuggestion
     * @param semester 開課學期
     */
    private fillSemester(semester: string): void {
        this.courseSemester = semester;
        this.isChoosingSemester = false;
    }

    /**
     * 選擇開課教師這個欄位，並展開dropdown
     */
    private chooseTeacher(): void {
        this.isChoosingTeacher = true;
    }

    /**
     * 將點選的課程名稱填入，並清空courseTitleSuggestion
     * @param semester 開課學期
     */
    private fillTeacher(teacher: string): void {
        this.courseTeacher = teacher;
        this.isChoosingTeacher = false;
        this.coursePoint = 3;
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
     * 初始化courseRate的值
     */
    private courseRateInit(): void {
        this.courseRate.gain = 5;
        this.courseRate.sweet = 5;
        this.courseRate.cold = 5;
        // this.courseForm.get('courseRate').get('gain').setValue(5);
        // this.courseForm.get('courseRate').get('sweet').setValue(5);
        // this.courseForm.get('courseRate').get('cold').setValue(5);
    }

    /**
     * 更改課程評分(需精簡整個code)
     * @param index:string 評分項目/ num:number 分數加或減(1 or -1)
     */
    private giveRate(index: string, num: number): void {
        if (index === 'gain') {
            this.courseRate.gain = this.courseRateCalc(this.courseRate.gain + num);
            // this.courseForm.get('courseRate').get('gain').setValue(this.courseRateCalc(this.courseForm.get('courseRate').get('gain').value + num))
        }
        if (index === 'sweet') {
            this.courseRate.sweet = this.courseRateCalc(this.courseRate.sweet + num);
            // this.courseForm.get('courseRate').get('sweet').setValue(this.courseRateCalc(this.courseForm.get('courseRate').get('sweet').value + num))
        }
        if (index === 'cold') {
            this.courseRate.cold = this.courseRateCalc(this.courseRate.cold + num);
            // this.courseForm.get('courseRate').get('cold').setValue(this.courseRateCalc(this.courseForm.get('courseRate').get('cold').value+ num))
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
     * 打包留言並送出
     */
    private sendComment(): void {
        if (this.courseForm.get('courseReview').value.length >= 50) {
            console.log(true);
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
