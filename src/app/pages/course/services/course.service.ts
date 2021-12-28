import { BehaviorSubject, Observable } from 'rxjs';
import {map, take, tap} from 'rxjs/operators';
import { AppService } from '../../../core/http/app.service';
import { AppUrl } from '../../../core/http/app.setting';
import {CourseModel, CourseRawModel} from '../models/Course.model';
import { Injectable } from '@angular/core';
import { CourseWithCommentModel } from '../models/CourseComment.model';
import {UserService} from '../../../core/service/user.service';

/**
 * 課程資訊 service <br/>
 *
 * @author Nick Liao
 * @date 2021/09/20
 */
@Injectable({
    providedIn: 'root',
})
export class CourseService {
    private courses$ = new BehaviorSubject<CourseModel[]>([]);

    constructor(
      private appService: AppService,
      private userService: UserService) {
        this.initCurrentSemesterCourses();
        console.log("course service");
    }

    /**
     * 抓取 當學期 所有課程資料
     */
    private initCurrentSemesterCourses(): void {
        this.appService.get({ url: AppUrl.GET_CURRENT_SEMESTER_COURSE() }).subscribe((res) => {
            const courses = (res.model.courses as CourseRawModel[]).map(rawCourse  => {
                return {
                    courseId: rawCourse.課程碼,
                    commentNum: rawCourse.comment_num,
                    courseCredit: rawCourse.學分,
                    courseIndex: rawCourse.選課序號,
                    courseName: rawCourse.系所名稱,
                    courseType: rawCourse.選必修,
                    teacher: rawCourse.老師,
                    deptId: rawCourse.系號,
                    deptName: rawCourse.系所名稱,
                    time: rawCourse.時間,
                    id: rawCourse.id
                };
            });
            courses.sort((a, b) => (a.commentNum > b.commentNum ? -1 : 1));
            this.courses$.next(courses);
        });
    }

    /**
     * 取得 當學期 所有課程
     */
    getCourseData(): Observable<CourseModel[]> {
        return this.courses$.asObservable().pipe(take(1));
    }

    /**
     * 抓取課程資料與心得
     * @param courseId
     * TODO: return type
     * @returns
     */
    fetchCourseWithComments(courseId: number): Observable<CourseWithCommentModel> {
        return this.appService
            .get({
                url: AppUrl.GET_ONE_COURSE(courseId),
            })
            .pipe(
                map((res) => res.model as CourseWithCommentModel),
                take(1)
            );
    }

    /**
     * 從現有課程中，利用`courseId`抓取單堂課程的資料
     * @param courseId
     * @returns `Course`
     */
    getCourseById(courseId: number): CourseModel {
        return this.courses$.getValue().find((course) => course.id === courseId)!;
    }
}
