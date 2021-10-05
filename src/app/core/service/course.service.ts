import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { tap } from "rxjs/operators";
import { AppService } from "../http/app.service";
import { AppUrl } from "../http/app.setting";
import { Course } from "../models/course.model";

/**
 * 課程資訊 service <br/>
 * 
 * @author Nick Liao
 * @date 2021/09/20
 */
 @Injectable({
    providedIn: 'root'
})
export class CourseService{
  private courses = new BehaviorSubject<Course[]>([])
  courses$ = this.courses.asObservable()

  constructor (
    private appService: AppService
  ) {
    this.fetchCourses()
  }

  /**
   * 抓取所有課程資料
   */
  private fetchCourses(): void {
    this.appService
      .get({ url: AppUrl.COURSE_URL })
      .pipe(
        tap(response => {
          const courses = response.model as Course[]
          courses.sort((a, b) => a.comment_num > b.comment_num ? -1 : 1)
          this.courses.next(courses)
        })
      ).subscribe()
  }

  /**
   * 抓取課程資料與心得
   * @param courseId 
   * @returns 
   */
  fetchCourseWithComments(courseId: number) {
    return this.appService.get({ url: `AppUrl.COURSE_URL/${courseId}` })
  }

  /**
   * 從現有課程中，利用`courseId`抓取單堂課程的資料
   * @param courseId 
   * @returns `Course`
   */
  getCourseById(courseId: number): Course {
    return this.courses.getValue().find(course => course.id === courseId)!
  }

}