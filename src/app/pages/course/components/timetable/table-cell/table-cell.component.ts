import { Component, OnInit, Input } from '@angular/core';
import { TimetableService } from '../../../services/timetable.service';
import { WishListService } from '../../../services/wish-list.service';
import { TableCellData } from '../../../models/Timetable.model';

@Component({
  selector: 'app-table-cell',
  templateUrl: './table-cell.component.html',
  styleUrls: ['./table-cell.component.scss']
})
export class TableCellComponent implements OnInit {

  // 展示版課表中的 此格資料
  @Input()
  cellData: TableCellData;

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
    if (this.cellData.ifFilterTime) {
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
   * 從使用者課表 移除 此格的課程
   */
  deleteItem() {
    if (this.cellData.time.hrs > 0) {
      this.wishListService.addWish(this.cellData.courseItem.id);
      this.timetableService.removeFromTempUserTable(this.cellData.courseItem);
    }
  }

  /**
   * TODO: ecfack 開關 時段篩選功能
   */
  startFilterTIme() {
    // if (this.cell_data.status == 0 && !pageStatus.table_locked) {
    //   var filtering = vue_classtable.markFilterCell(this.day, this.cell_data.time);
    //   if (filtering) {
    //     vue_wishlist.clearFilter();
    //     vue_wishlist.filterItemTIme(this.day, this.cell_data.time);
    //   }
    //   else {
    //     vue_wishlist.clearFilter();
    //   }
    // }
  }
}
