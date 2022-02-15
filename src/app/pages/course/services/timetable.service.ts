import { Injectable } from '@angular/core';
import { CourseService } from './course.service';
import { take, filter, share } from 'rxjs/operators';
import { CourseModel } from '../models/Course.model';
import { Observable, BehaviorSubject } from 'rxjs';
import { TimetableInfo, TableCellData, TimeObject } from '../models/Timetable.model';

@Injectable({
  providedIn: 'root'
})
export class TimetableService {
  constructor(private courseService: CourseService) {
    // 取得 所有課程資料 -> 取得 使用者課表 -> 把前兩者資料 填入 展示版課表
    this.fetchAndRefreshTables();
  }

  // 完整的本學期課程，為了把 傳入的課程id 轉成 課程
  private allCourseInNewSemester: CourseModel[] = [];

  // 展示版課表：紀錄 所有與展示相關的資料，詳見 TableCellData
  // 平日上課時間的展示資料，屬於 展示版課表
  // 5*14的陣列，代表 每周5個工作日 和 每天14節課
  private displayedTableWorkdays: TableCellData[][] = [];
  private static WORKDAYS = 5;
  private static COURSES_PER_WORKDAY = 14;
  // 非平日上課時間的展示資料，屬於 展示版課表
  private displayedTableOtherDays: CourseModel[] = [];

  // 使用者課表：只由選課序號 組成 的陣列
  // 暫時紀錄用的使用者課表
  private tempUserTable: number[] = [];

  // 使用者的當前學分數
  private credits: number = 0;

  // 當前時間篩選條件
  private timeFilter: TimeObject | null = null;

  // 最新的課表相關資訊
  private timetableInfo$ = new BehaviorSubject<TimetableInfo>(
    new TimetableInfo(this.displayedTableWorkdays,
      this.displayedTableOtherDays,
      this.tempUserTable,
      this.credits,
      this.timeFilter)
  );

  /**
   * 回傳 發送最新課表相關資訊的 Observable
   */
  getTimetableInfo(): Observable<TimetableInfo> {
    return this.timetableInfo$.pipe(share());
  }

  /**
   * 檢測 特定課程 是否撞課 在展示版課表，若是 則在展示板課表 標示撞課
   * @param courseItem 特定課程的資訊
   * @returns false：未撞課，true：已撞課
   */
  isConflicted(courseItem: CourseModel): boolean {
    let tableItem = this.displayedTableWorkdays;

    const timeItem = TimeObject.getTimeObject(courseItem.time);
    // 如果 此門課程 非平日時段
    if (!timeItem.length) {
      const isInDisplayedTable = this.displayedTableOtherDays.find(course => course.id === courseItem.id);
      const isInUserTable = this.tempUserTable.includes(courseItem.id);
      // 此判斷式缺一不可
      // 缺前者：造成 refreshTable() 無法放入 非平日時段課程，缺後者：無法區分 此課程 是否是 預覽中
      if (isInDisplayedTable && isInUserTable)
        return true;
      else
        return false;
    }

    // 檢測 特定課程的 各個時段狀況
    let day, start, hrs;
    for(let classTime of timeItem) {
      day = classTime.day;
      start = classTime.start;
      hrs = classTime.hrs;

      for (let j = 0; j < hrs; ++j) {
        let checkCell = tableItem[day][start + j];
        // 如果 當前時段 被占用
        if (checkCell.time.hrs !== 0) {
          // 如果 是同一門課互撞，不標記 撞課
          if (checkCell.courseItem.id === courseItem.id) {
            if (checkCell.isPreviewing) {
              return false;
            }
            else {
              return true;
            }
          }
          // 如果 非同一門課互撞，標記 撞課
          else {
            // 對此時在課表的課程 標記衝堂
            // console.log('checkConflict: 找到衝堂');
            if (checkCell.time.hrs > 0) {
              checkCell.cellStatusTitle = "時段衝堂";
              checkCell.isConflicted = true;
            }
            else {
              for (let k = 1; k <= start; ++k) {
                let originCell = tableItem[day][start - k];
                // console.log(origin_cell.time.hrs);
                if (originCell.time.hrs > 0) {
                  originCell.cellStatusTitle = "時段衝堂";
                  originCell.isConflicted = true;
                  break;
                }
              }
            }
            this.timetableInfo$.next(
              new TimetableInfo(this.displayedTableWorkdays,
                this.displayedTableOtherDays,
                this.tempUserTable,
                this.credits,
                this.timeFilter)
            );
            return true;
          }
        }
      }
    }
    return false;
  }

  /**
   * 根據使用者課表 和 預覽中的課程，填入 展示版課表 和 計算 學分數
   * @param previewId 預覽中的課程Id
   */
  refreshDisplayedTable(previewId: number): void {
    this.initDisplayedTable();

    this.credits = 0;

    for (let courseId of this.tempUserTable) {
      const targetId = courseId;
      this.addToDisplayedTable(targetId, false);
    }

    // 加入 預覽中課程
    if (previewId !== -1) {
      this.addToDisplayedTable(previewId, true);
    }

    // 加入 當前時間篩選
    if(this.timeFilter) {
      // this.setTimeFilter(this.timeFilter);
      this.displayedTableWorkdays[this.timeFilter.day][this.timeFilter.start].isFilterTime=true;
    }

    this.timetableInfo$.next(
      new TimetableInfo(this.displayedTableWorkdays,
        this.displayedTableOtherDays,
        this.tempUserTable,
        this.credits,
        this.timeFilter)
    );
  }

  /**
   * 把特定課程 加入 使用者課表 和 刷新 展示版課表
   * @param target 特定課程的資訊
   */
  addToTempUserTable(target: CourseModel): void {
    if (!this.isConflicted(target)) {
      this.tempUserTable.push(target.id);
      this.refreshDisplayedTable(-1);
    }
  }

  /**
   * 從使用者課表 移除 特定課程，並加入 願望清單，刷新 展示版課表
   * @param courseId 特定課程的Id
   */
  removeFromTempUserTable(target: CourseModel): void {
    this.tempUserTable = this.tempUserTable.filter(courseId => courseId !== target.id)
    this.refreshDisplayedTable(-1);
  }

  /**
   * 設置 當前時間篩選條件，並標註在 展示板課表上的 對應位置
   * @param setedTime 要設置的 時間篩選條件，null：取消 當前設置的 時間篩選條件
   */
  setTimeFilter(setedTime: TimeObject | null): void {

    if (setedTime) {
      const day = setedTime.day;
      const start = setedTime.start;
      const hrs = setedTime.hrs;
      if (!hrs) {
        // 標註在展示板課表
        for (let i = 0; i < TimetableService.WORKDAYS; ++i) {
          for (let j = 0; j < TimetableService.COURSES_PER_WORKDAY; ++j) {
            // 如果 對應位置之前為篩選條件(true)，則代表 清空 時間篩選條件，因此 需標註為false
            // 若非 則正常標註
            if(i===day && j===start)
              this.displayedTableWorkdays[i][j].isFilterTime =!this.displayedTableWorkdays[i][j].isFilterTime;
            else
              this.displayedTableWorkdays[i][j].isFilterTime = false;
          }
        }

        // 根據 課表格的 標註狀態，設置 當前的時間篩選條件
        if(this.displayedTableWorkdays[day][start].isFilterTime)
          this.timeFilter = setedTime;
        else
          this.timeFilter=null;
      }
    }
    else {
      // 標註在展示板課表
      for (let i = 0; i < TimetableService.WORKDAYS; ++i) {
        for (let j = 0; j < TimetableService.COURSES_PER_WORKDAY; ++j) {
          this.displayedTableWorkdays[i][j].isFilterTime = false;
        }
      }
      this.timeFilter = setedTime;
    }

    this.timetableInfo$.next(
      new TimetableInfo(this.displayedTableWorkdays,
        this.displayedTableOtherDays,
        this.tempUserTable,
        this.credits,
        this.timeFilter)
    );
  }

  /**
   *  TODO: ecfack 獲取 完整課程資料 和 使用者課表，根據前兩者資料 填充 展示版課表
   */
  private fetchAndRefreshTables(): void {
    // 加filter是因為可能會收到空陣列
    this.courseService.getCourseData().pipe(filter(data => data.length != 0), take(1)).subscribe(
      (courseData) => {
        this.allCourseInNewSemester = courseData;
        // 獲取 使用者課表
        this.fetchUserTable();
        // 填充 展示版課表
        this.refreshDisplayedTable(-1);
      },
      (err: any) => {
        if (err) {
          console.error(err);
        }
      }
    );
  }

  /**
   * 初始化 展示版課表
   */
  private initDisplayedTable(): void {
    this.displayedTableWorkdays.length = 0;

    let tableCellData: TableCellData;
    // 星期一到五
    for (let i = 0; i < TimetableService.WORKDAYS; ++i) {
      this.displayedTableWorkdays.push([]);
      // 一天14節課
      for (let j = 0; j < TimetableService.COURSES_PER_WORKDAY; ++j) {
        tableCellData = new TableCellData();
        tableCellData.time.day = i;
        tableCellData.time.start = j;
        this.displayedTableWorkdays[i].push(tableCellData);
      }
    }

    this.displayedTableOtherDays.length = 0;
  }

  /**
   * 打API 獲取 使用者課表
   */
  private fetchUserTable(): void {
    this.tempUserTable.length = 0;
    // TODO: fake data
    this.tempUserTable.push(1730, 2059, 409, 9728);
  }

  /**
   * 把特定課程 加入 展示版課表
   * @param courseId 特定課程的Id
   * @param isPreviewing false：以非預覽(正式)的狀態 加入 展示版課表，true：以預覽的狀態 加入 展示版課表
   */
  private addToDisplayedTable(courseId: number, isPreviewing: boolean): void {
    // 取得 特定課程的完整資料
    const courseItem: CourseModel | undefined = this.allCourseInNewSemester.find(course => course.id === courseId);
    if (!courseItem) {
      return;
    }
    // 把時間 轉成 可被展示版課表接受的形式
    let timeItem = TimeObject.getTimeObject(courseItem.time);
    // 如果沒撞課
    if (!this.isConflicted(courseItem)) {

      // 計算 學分數
      if (!isPreviewing) {
        this.credits += courseItem.courseCredit;
      }

      // 特定課程 加入 展示版課表
      // 如果 非平日上課時段
      if (!timeItem.length) {
        this.displayedTableOtherDays.push(courseItem);
      }
      else {
        let day, start, hrs, fillCell: TableCellData;
        // 將各起始時段 填入 展示版課表
        for (let classTime of timeItem) {
          // console.log(time_item);
          day = classTime.day;
          start = classTime.start;
          hrs = classTime.hrs;

          // 把當前起始時段 填入 展示版課表
          fillCell = this.displayedTableWorkdays[day][start];
          fillCell.time.hrs = hrs;
          fillCell.courseItem = courseItem;
          fillCell.cellStatusTitle = fillCell.courseItem.deptId + '-' + fillCell.courseItem.courseIndex;
          fillCell.cellStatusText = fillCell.courseItem.courseName;

          // 設定 當時段的 預覽狀態
          fillCell.isPreviewing = isPreviewing;

          // 將後續被占用時段的 time.hrs 設定為 -1
          for (let j = 1; j < hrs; ++j) {
            fillCell = this.displayedTableWorkdays[day][start + j];
            fillCell.time.hrs = -1;
            fillCell.cellStatusTitle = '';
            fillCell.cellStatusText = '';
          }

        }
      }
    }
    else {
      // console.log('toTable 時發生錯誤(撞課)！');
    }
  }
}