import { Observable, Subject } from 'rxjs';
import { map, take, share } from 'rxjs/operators';
import { AppService } from '../../../core/http/app.service';
import { AppUrl } from '../../../core/http/app.setting';
import { CourseModel, CourseRawModel } from '../models/Course.model';
import { Injectable } from '@angular/core';
import { CourseWithCommentModel } from '../models/CourseComment.model';
import { UserService } from '../../../core/service/user.service';
import { DepartmentModel } from '../models/Department.model';

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
    // 當學期課程
    private newSemesterCourseList$ = new Subject<CourseModel[]>();

    constructor(private appService: AppService, private userService: UserService) {
        this.initCurrentSemesterCourses();
    }

    /**
     * 抓取 當學期 所有課程資料
     * @private
     */
    private initCurrentSemesterCourses(): void {
        this.appService.get({ url: AppUrl.GET_CURRENT_SEMESTER_COURSE() }).subscribe((res) => {
            // 除去 中文屬性
            const courses = (res.model.courses as CourseRawModel[]).map(this.convertToCourseModel);
            // 排序: 心得數 大 -> 小
            courses.sort((a, b) => (a.commentNum > b.commentNum ? -1 : 1));
            this.newSemesterCourseList$.next(courses);
        });
    }

    /**
     * 取得 當學期 所有課程
     */
    getCourseData(): Observable<CourseModel[]> {
        return this.newSemesterCourseList$.pipe(take(1), share());
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
                map((res) => {
                    const mappingModel = res.model as CourseWithCommentModel;
                    mappingModel.courseInfo = this.convertToCourseModel(res.model.courseInfo);
                    return mappingModel;
                }),
                take(1)
            );
    }

    /**
     * 從現有課程中，利用`courseId`抓取單堂課程的資料
     * @param courseId
     * @returns `Course`
     */
    getCourseById(courseId: number): Observable<CourseModel> {
        // TODO: cache search result by map
        return this.newSemesterCourseList$.pipe(
            map((courseList) => courseList.find((course) => course.id === courseId)),
            take(1)
        );
    }

    /**
     * 利用courseName抓取相同課程名稱過去的資料
     * @param courseName
     * @returns `Course`
     */
    getCourseByCourseName(courseName: string): Observable<CourseModel> {
        this.initCurrentSemesterCourses();
        // TODO: cache search result by map
        return this.newSemesterCourseList$.pipe(
            map((courseList) => courseList.find((course) => course.courseName === courseName)),
            take(1)
        );
    }

    /**
     * 資料轉型態 CourseRawModel => CourseModel
     * @param rawCourse: CourseRawModel
     * @private
     */
    private convertToCourseModel = (rawCourse: CourseRawModel): CourseModel => {
        const courseModelData = {
            courseId: rawCourse.課程碼,
            commentNum: rawCourse.comment_num,
            courseCredit: rawCourse.學分,
            courseIndex: rawCourse.選課序號,
            courseName: rawCourse.課程名稱,
            courseType: rawCourse.選必修,
            teacher: rawCourse.老師,
            deptId: rawCourse.系號,
            deptName: rawCourse.系所名稱,
            time: rawCourse.時間,
            id: rawCourse.id,
        };
        return courseModelData;
    };

    /**
     * 抓取所有系所資料
     */
    fetchDepartments(): Observable<DepartmentModel[]> {
        return this.appService
            .get({
                url: AppUrl.GET_COURSE_DEPT_INFO(),
            })
            .pipe(
                map((res) => res.model as DepartmentModel[]),
                take(1)
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
}
