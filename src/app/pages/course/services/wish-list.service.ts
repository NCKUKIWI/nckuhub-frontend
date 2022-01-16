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

    //wishList：感興趣的課程，用於加入課表，查看心得
    //TODO：建立Subject用來發送每次更動後的wishlist，addWish，removeWish
    //用法：componemt訂閱Subject，只使用addWish，removeWish
    //checkVali：檢查wishList長度，是否有對應到課程，清除重複元素
    //addWish：增加wish在wishList，再讓subject next wishList
    //removeWish：減少wish在wishList，再讓subject next wishList
    //uploadWis：回傳wishList到DB，定量回傳？定時回傳？
}
