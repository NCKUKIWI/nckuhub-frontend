import { Component, OnInit, OnDestroy } from '@angular/core';
import { CourseModel } from '../../models/Course.model';
import { Subscription } from 'rxjs';
import { WishListService } from '../../services/wish-list.service';

@Component({
    selector: 'app-wish-list',
    templateUrl: './wish-list.component.html',
    styleUrls: ['./wish-list.component.scss'],
})
export class WishListComponent implements OnInit, OnDestroy {

    // 使用者的願望清單
    wishList: CourseModel[] = [];
    // 用於 取消訂閱 發送願望清單的Observable
    wishListSubscription: Subscription;

    constructor(private wishListService: WishListService) {
    }

    ngOnInit(): void {
        // 訂閱 使用者的願望清單
        this.getWishList();
    }

    ngOnDestroy(): void {
        // 取消訂閱 使用者的願望清單
        this.wishListSubscription.unsubscribe();
    }

    /**
     *  訂閱 以隨時獲取 最新的願望清單
     */
    private getWishList(): void {
        this.wishListSubscription = this.wishListService.getWishList().subscribe(
            (wishList) => {
                this.wishList = wishList;
            },
            (err: any) => {
                if (err) {
                    console.error(err);
                }
            }
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

    /**
     * 使用者 點擊 願望清單上的願望後，從願望清單 移除 願望
     * @param courseId 願望(課程)的Id
     */
    removeWish(courseId: number): void {
        this.wishListService.removeWish(courseId);
    }

    /**
     * 從願望清單 轉移至 課表
     */
    openTableTab(): void {
    }
}
