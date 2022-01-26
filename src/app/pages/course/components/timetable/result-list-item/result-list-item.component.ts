import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TimetableService } from '../../../services/timetable.service';
import { CourseModel } from '../../../models/Course.model';

@Component({
  selector: 'app-result-list-item',
  templateUrl: './result-list-item.component.html',
  styleUrls: ['./result-list-item.component.scss']
})
export class ResultListItemComponent implements OnInit {

  // 此格搜尋結果的 課程資料
  @Input()
  courseData: CourseModel;

  // 要求清空 父元件的 keyword
  @Output()
  refreshKeyword = new EventEmitter<string>();

  constructor(private timetableService: TimetableService) { }

  ngOnInit(): void {
  }

  /**
   * 跟據 此格的課程資訊，取得 對應的CSS class
   * @returns 對應的CSS class名稱
   */
  getClass(): string {
    return this.courseData.deptId;
  }

  /**
   * 將此格的搜尋結果 加入 使用者課表
   */
  addToTable(): void {
    if (!this.timetableService.isConflicted(this.courseData)) {
      this.timetableService.addToTempUserTable(this.courseData);
      // 加入 使用者課表成功後，清空 搜尋欄
      this.refreshKeyword.emit("");
    }
  }

  /**
   * 將此格的搜尋結果 以預覽的方式 加入 展示版課表
   */
  mouseoverItem() {
    if (!this.timetableService.isConflicted(this.courseData)) {
      this.timetableService.refreshDisplayedTable(this.courseData.id);
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
