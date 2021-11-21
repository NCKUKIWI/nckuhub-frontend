import { Injectable } from '@angular/core';
import { User } from 'src/app/core/models/user.model';
import { AppService } from '../http/app.service';
import { UserService } from '../service/user.service';

/**
 * 權限控管 service <br/>
 *
 * @author Nick Liao
 * @date 2021/09/20
 */
@Injectable({
    providedIn: 'root',
})
export class AuthService {
    constructor(
        private appService: AppService,
        private userService: UserService
    ) {}

    /**
     * 登入
     */
    login() {
        this.fbStragety();
        // TODO add user info
        this.userService.loginUser(new User());
    }

    /**
     * 登出
     */
    logout() {
        // TODO: remove session or token ??

        this.userService.logoutUser();

        // redirect to home
        setTimeout(() => {
            window.location.href = '/';
        }, 300);
    }

    /**
     * fb 登入
     */
    fbStragety() {
        // TODO: Fb 登入實作
    }
}
