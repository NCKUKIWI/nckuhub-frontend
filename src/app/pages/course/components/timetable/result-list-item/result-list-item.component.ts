import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TimetableService, TableCellData } from '../../../services/timetable.service';
import { CourseModel } from '../../../models/Course.model';

@Component({
  selector: 'app-result-list-item',
  templateUrl: './result-list-item.component.html',
  styleUrls: ['./result-list-item.component.scss']
})
export class ResultListItemComponent implements OnInit {

  // 此格的資料
  @Input()
  courseData: CourseModel;

  @Output()
  refreshKeyword = new EventEmitter<string>();

  constructor(private timetableService: TimetableService) { }

  ngOnInit(): void {
  }

  getClass(): string {
    return this.courseData.deptId;
  }

  addToTable(): void {
    if (!this.timetableService.tempTable.includes(this.courseData.id)) {
      if (!this.timetableService.isConflicted(this.courseData, this.timetableService.coursesOnWorkdays)) {
        this.timetableService.addToTempTable(this.courseData.id);
        this.refreshKeyword.emit("");
        // vue_classtable.clearFilterCell();
        // vue_wishlist.clearFilter();
        // setNotification('成功加入課表！', 'blue');
      }
    }
  }

  mouseoverItem() {
    if (!this.timetableService.isConflicted(this.courseData, this.timetableService.coursesOnWorkdays)) {
      this.timetableService.refreshTable(this.courseData.id);
    }
  }

  mouseoutItem() {
    this.timetableService.refreshTable(-1);
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
