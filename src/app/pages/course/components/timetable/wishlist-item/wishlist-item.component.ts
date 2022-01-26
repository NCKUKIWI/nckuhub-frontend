import { Component, OnInit, Input } from '@angular/core';
import { CourseModel } from '../../../models/Course.model';
import { TimetableService } from '../../../services/timetable.service';
import { WishListService } from '../../../services/wish-list.service';

@Component({
  selector: 'app-wishlist-item',
  templateUrl: './wishlist-item.component.html',
  styleUrls: ['./wishlist-item.component.scss']
})
export class WishlistItemComponent implements OnInit {

  // 願望清單上的 某個願望
  @Input()
  courseItem: CourseModel;

  constructor(private timetableService: TimetableService, private wishListService: WishListService) { }

  ngOnInit(): void {
  }

  /**
   * 根據 此格的課程資訊，取得 對應的CSS class
   * @returns 對應的CSS class名稱
   */
  getClass() {
    return this.courseItem.deptId;
  }

  /**
   * 將此願望 加入 使用者課表
   */
  addToTable() {
    if (!this.timetableService.isConflicted(this.courseItem)) {
      this.wishListService.removeWish(this.courseItem.id);
      this.timetableService.addToTempUserTable(this.courseItem);
    }
  }

  /**
   * 將此願望 從願望清單 移除，並刷新 展示板課表
   */
  deleteItem() {
    this.wishListService.removeWish(this.courseItem.id);
    this.timetableService.refreshDisplayedTable(-1);
  }

  /**
   * 將此格的搜尋結果 以預覽的方式 加入 展示版課表
   */
  mouseoverItem() {
    if (!this.timetableService.isConflicted(this.courseItem)) {
      this.timetableService.refreshDisplayedTable(this.courseItem.id);
    }
  }

  /**
   * 從展示版課表 移除預覽課程
   */
  mouseoutItem() {
    this.timetableService.refreshDisplayedTable(-1);
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
