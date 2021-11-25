import {Injectable} from '@angular/core';
import {UserService} from '../../../core/service/user.service';
import {BehaviorSubject} from 'rxjs';

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
    private wishList$ = new BehaviorSubject<[]>([]);

    constructor(private userService: UserService) {
    }
}
