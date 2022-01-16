import { Component, OnInit } from '@angular/core';
import { CourseModel } from '../../models/Course.model';

@Component({
    selector: 'app-wish-list',
    templateUrl: './wish-list.component.html',
    styleUrls: ['./wish-list.component.scss'],
})
export class WishListComponent implements OnInit {
    wishList: CourseModel[] = [];
    constructor() { }

    ngOnInit(): void { }

    deleteWish(wishId:Number):void {
        this.wishList=this.wishList.filter((course) => course.id !== wishId);
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
