import { Component, OnInit, Input } from '@angular/core';
import { CourseModel } from '../../../models/Course.model';
import { TimetableService } from '../../../services/timetable.service';
import { WishListService } from '../../../services/wish-list.service';
import { CourseService } from '../../../services/course.service';

@Component({
  selector: 'app-wishlist-item',
  templateUrl: './wishlist-item.component.html',
  styleUrls: ['./wishlist-item.component.scss']
})
export class WishlistItemComponent implements OnInit {

  // 願望清單上的 某個願望
  @Input()
  courseItem: CourseModel;

  constructor(
    private timetableService: TimetableService, 
    private wishListService: WishListService,
    private courseService: CourseService
  ) { }

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
      //TODO: setNotification ( '成功加入課表！', 'blue' );
      this.timetableService.setTimeFilter(null);
      this.wishListService.removeWish(this.courseItem.id);
      this.timetableService.addToTempUserTable(this.courseItem);
    }
  }

  /**
   * 將此願望 從願望清單 移除，並刷新 展示板課表
   */
  deleteItem() {
    this.timetableService.setTimeFilter(null);
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
    return this.courseService.deptTransCat(deptID, deptName);
  }
}
