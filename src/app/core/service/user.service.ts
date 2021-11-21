import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { User } from 'src/app/core/models/user.model';
import { UserStatusEnum } from '../enum/user-staus';
import { AppService } from '../http/app.service';
import { AppUrl } from '../http/app.setting';
import { Course } from '../models/course.model';
import { NckuhubResponse } from '../models/http-vo-model';

/**
 * 使用者資料 service <br/>
 *
 * @author Nick Liao
 * @date 2021/09/20
 */
@Injectable({
    providedIn: 'root',
})
export class UserService {
    constructor(private appService: AppService) {}

    /** 心得 */
    /** 基本資料 */
    /** 願望清單 */
    wishCourses: Course[] = [];

    /**
     * 抓取現在使用者的願望清單
     */
    getCurrentUserWishes() {
        // TODO: 抓取現在使用者的願望清單
    }

    /**
     * 新增現在使用者的願望
     */
    addUserWish(courseId: number) {
        // TODO: 新增現在使用者的願望
    }

    /**
     * 刪除現在使用者的願望
     */
    deleteUserFavorite(courseId: number) {
        // TODO: 刪除現在使用者的願望
    }

    /**
     * 判斷是否已經被加入願望清單
     */
    isInWishes(courseId: number) {
        return !!this.wishCourses.find((course) => course.id === courseId);
    }

    /** 課表 */
    table: number[] = [];

    /**
     * 抓取現在使用者的課表
     */
    getCurrentUserTable() {
        // TODO: 抓取現在使用者的課表
    }

    /**
     * 儲存現在使用者的課表
     */
    saveCurrentUserTable() {
        // TODO: 儲存現在使用者的課表
    }

    /**
     * 取得 當前使用者
     * @returns
     */
    getCurrentUser(): Observable<User> {
        const currentUser = sessionStorage.getItem('currentUser');
        if (currentUser != null) {
            let userJson = JSON.parse(decodeURI(atob(currentUser)));
            return of(userJson);
        }
        return this.receiveUserInfo();
    }

    /**
     * 取得 目前使用者狀態
     * @returns
     */
    getUserStatus(): UserStatusEnum {
        const currentUser = sessionStorage.getItem('currentUser');
        if (currentUser != null) {
            return UserStatusEnum.LOGIN;
        } else {
            return UserStatusEnum.LOGOUT;
        }
    }

    /**
     * 取得 願望清單
     */
    getUserWishList(): Observable<any> {
        // TODO
        return of();
    }

    /**
     * 取得 心得
     */
    getUserCommentList(): Observable<any> {
        // TODO
        return of();
    }

    /**
     * 取得 課程資料
     */
    getUserTableData(): Observable<any> {
        // TODO
        return of();
    }

    /**
     * 存入 sessionStorage
     * @param user
     */
    loginUser(user: User) {
        const base64 = btoa(encodeURI(JSON.stringify(user)));
        sessionStorage.setItem('currentUser', base64);
    }

    /**
     * 登出，清除angular的登入資訊
     * @return n/a
     */
    logoutUser() {
        sessionStorage.removeItem('currentUser');
    }

    /**
     * 獲取 使用者資料
     * @returns
     */
    private receiveUserInfo(): Observable<User> {
        return this.appService
            .post({
                url: AppUrl.LOGIN_USER_URL,
            })
            .pipe(
                map((res) => this.toUser(res)),
                tap((user) => this.loginUser(user))
            );
    }

    /**
     * Response to User mapping
     * @param res
     * @returns */
    private toUser(res: NckuhubResponse): User {
        let user = new User();
        user.userId = res.model.userId;
        user.userName = res.model.userName;
        return user;
    }
}
