import { Component, OnInit, Input,Output,EventEmitter } from '@angular/core';
import { TimetableService } from '../../../services/timetable.service';
import { WishListService } from '../../../services/wish-list.service';
import { TableCellData,TimeObject } from '../../../models/Timetable.model';

@Component({
  selector: 'app-table-cell',
  templateUrl: './table-cell.component.html',
  styleUrls: ['./table-cell.component.scss']
})
export class TableCellComponent implements OnInit {

  @Input()
  lockStatus:boolean=false;

  // 展示版課表中的 此格資料
  @Input()
  cellData: TableCellData;

  // 要求 父元件 動用 時間篩選功能
  @Output()
  setFilter = new EventEmitter<TimeObject>();

  constructor(private timetableService: TimetableService,private wishListService: WishListService) { }

  ngOnInit(): void {
  }

  /**
   * 計算 占用此格的課程 要佔據幾格，並套用至 此格的CSS
   * @returns JSON資料，計算後的CSS style
   */
  getHeight(): any {
    let style;
    // 如果 當格是 課程的起始時段
    if (this.cellData.time.hrs > 0) {
      style = {
        'height': 'calc( ( (82vh - 44px) / 10 ) * ' + this.cellData.time.hrs + ' )',
        'min-height': 'calc(50px * ' + this.cellData.time.hrs + ')'
      };
    }
    else if (this.cellData.time.hrs < 0) {
      style = { 'display': 'none' };
    }
    return style;
  }

  /**
   * 跟據 此格的flags，取得 對應的CSS class
   * @returns 對應的CSS class名稱
   */
  getClass(): string {
    let classContext = '';
    if (this.cellData.time.hrs > 0) {
      classContext += 'occupied ';
    }
    if (this.cellData.isFilterTime) {
      classContext += 'filtering ';
    }
    if (this.cellData.isPreviewing) {
      classContext += 'previewing ';
    }
    if (this.cellData.isConflicted) {
      classContext += 'rush ';
    }
    classContext += this.cellData.courseItem.deptId;
    return classContext;
  }

  /**
   * 從使用者課表 移除 此格的課程，並清除 時間篩選
   */
  deleteItem() {
    if (this.cellData.time.hrs > 0) {
      this.timetableService.setTimeFilter(null);
      this.wishListService.addWish(this.cellData.courseItem.id);
      this.timetableService.removeFromTempUserTable(this.cellData.courseItem);
    }
  }

  /**
   * 對父元件 發出 時段篩選請求
   */
  setTimeFilter() {
    this.setFilter.emit(this.cellData.time);
  }
}
