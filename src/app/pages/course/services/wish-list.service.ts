import { Injectable } from '@angular/core';
import { UserService } from '../../../core/service/user.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { CourseModel } from '../models/Course.model';
import { CourseService } from './course.service';
import { take, filter, share } from 'rxjs/operators';

/**
 * 課程資訊 service <br/>
 *
 * @author Nick Liao
 * @date 2021/09/20
 */
@Injectable({
    providedIn: 'root',
})
export class WishListService {

    // 用於 發送 當前最新的願望清單
    private wishList$ = new BehaviorSubject<CourseModel[]>([]);
    // 當前最新的願望清單
    private wishList: CourseModel[] = [];
    // 完整的本學期課程，為了把 傳入 的課程id 轉成 課程
    private allCourseInNewSemester: CourseModel[] = [];

    constructor(private userService: UserService, private courseService: CourseService) {
        // 取得 完整的本學期課程資料
        this.getCourseData();
    }

    /**
     *  打API拿 完整課程資料
     */
    private getCourseData(): void {
        // 加filter是因為可能會收到空陣列
        this.courseService.getCourseData().pipe(filter(data => data.length != 0), take(1)).subscribe(
            (courseData) => {
                this.allCourseInNewSemester = courseData;
                console.log("願望清單獲取總課程成功", this.allCourseInNewSemester.length);
            },
            (err: any) => {
                if (err) {
                    console.error(err);
                }
            }
        );
    }

    /**
     * 回傳 當前使用者 願望清單的Observable
     */
    getWishList(): Observable<CourseModel[]> {
        return this.wishList$.pipe(share());
    }

    /**
     * 新增 願望 至願望清單，並 發送 最新的願望清單
     * @param courseId 願望(課程)的id
     */
    addWish(courseId: number): void {
        const wish: CourseModel | undefined = this.allCourseInNewSemester.find(course => course.id === courseId);
        if (wish) {
            this.wishList.push(wish);
            this.wishList$.next(this.wishList);
        }
    }

    /**
     * 移除 願望 從願望清單，並 發送 最新的願望清單
     * @param courseId 願望(課程)的id
     */
    removeWish(courseId: number): void {
        this.wishList = this.wishList.filter(wish => wish.id !== courseId);
        this.wishList$.next(this.wishList);
    }

    /**
     * 檢查 願望 是否在 願望清單
     * @param courseId 願望(課程)的id
     * @returns false：不在願望清單，true：在願望清單
     */
    public isInWishList(courseId: number): boolean {
        return this.wishList.findIndex((course) => course.id === courseId) !== -1;
    }

    // TODO: ecfack checkVali：檢查wishList長度，是否有對應到課程，清除重複元素，從DB獲取願望清單時呼叫
    // TODO: ecfack uploadWis：回傳wishList到DB，定量回傳？定時回傳？
}
