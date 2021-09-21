import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { map, tap } from "rxjs/operators";
import { User } from "src/app/shared/models/user.model";
import { UserStatusEnum } from "../enum/user-staus";
import { AppService } from "../http/app.service";
import { AppUrl } from "../http/app.setting";
import { NckuhubResponse } from "../http/http-vo-model";

/**
 * 使用者資料 service <br/>
 * 
 * @author Nick Liao
 * @date 2021/09/20
 */
@Injectable({
    providedIn: 'root'
})
export class UserService{

    constructor(
        private appService: AppService
    ){}

    /** 心得 */
    /** 基本資料 */
    /** 願望清單 */
    /** 課表 */
   
    /**
     * 取得 當前使用者
     * @returns 
     */
    getCurrentUser(): Observable<User>{
        const currentUser = sessionStorage.getItem('currentUser');
        if( currentUser != null){
            let userJson = JSON.parse(decodeURI(atob(currentUser)));
            return of(userJson)
        }
        return this.receiveUserInfo();
    }

    /**
     * 取得 目前使用者狀態
     * @returns 
     */
    getUserStatus(): UserStatusEnum{
        const currentUser = sessionStorage.getItem('currentUser');
        if(currentUser != null){
            return UserStatusEnum.LOGIN;
        }
        else {
            return UserStatusEnum.LOGOUT;
        }
    }

    /**
     * 取得 願望清單
     */
    getUserWishList(): Observable<any>{
        // TODO
        return of();
    }

    /**
     * 取得 心得
     */
    getUserCommentList(): Observable<any>{
         // TODO
        return of();
    }
 
    /**
     * 取得 課程資料
     */
    getUserTableData(): Observable<any>{
         // TODO
        return of();
    }

    /**
     * 存入 sessionStorage
     * @param user 
     */
    loginUser(user: User){
        const base64 = btoa(encodeURI(JSON.stringify(user)));
        sessionStorage.setItem('currentUser', base64)        
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
        return this.appService.post({
            url: AppUrl.LOGIN_USER_URL
        }).pipe(
                map(res => this.toUser(res)),
                tap(user => this.loginUser(user))                
            )
    }

    /**
     * Response to User mapping
     * @param res 
     * @returns */
    private toUser(res: NckuhubResponse): User{
        let user = new User();
        user.userId = res.model.userId;
        user.userName = res.model.userName;
        return user;
    }
}