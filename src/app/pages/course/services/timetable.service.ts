import { Injectable } from '@angular/core';
import { CourseService } from './course.service';
import { take, filter, share } from 'rxjs/operators';
import { CourseModel } from '../models/Course.model';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimetableService {
  constructor(private courseService: CourseService) {
    // 取得 所有課程資料 -> 取得 使用者課表 -> 把前兩者資料 填入 展示版課表
    this.fetchAndRefreshTable();
  }

  // 完整的本學期課程，為了把 傳入的課程id 轉成 課程
  allCourseInNewSemester: CourseModel[] = [];

  // 展示版課表：紀錄 所有與展示相關的資料，詳見 TableCellData
  // 平日上課時間的展示資料，屬於 展示版課表
  // 5*14的陣列，代表 每周5個工作日 和 每天14節課
  coursesOnWorkdays: TableCellData[][] = [];
  // 非平日上課時間的展示資料，屬於 展示版課表
  coursesOnOtherDays: CourseModel[] = [];

  // 使用者課表：只由選課序號 組成 的陣列
  // 暫時紀錄用的使用者課表
  tempTable: number[] = [];

  // 使用者的當前學分數
  credits: number = 0;
  private credits$ = new BehaviorSubject<number>(this.credits);

  // TODO: ecfack 搬運舊版code
  // filtering_now: {
  //     day: '',
  //     time: ''
  // };
  // page_status: pageStatus;
  // temp_wishlist: [];

  /**
     * 回傳 當前使用者 願望清單的Observable
     */
  getCredits(): Observable<number> {
    return this.credits$.pipe(share());
  }

  /**
   *  獲取 完整課程資料 和 使用者課表，根據前兩者資料 填充 展示版課表
   */
  private fetchAndRefreshTable(): void {
    // 加filter是因為可能會收到空陣列
    this.courseService.getCourseData().pipe(filter(data => data.length != 0), take(1)).subscribe(
      (courseData) => {
        this.allCourseInNewSemester = courseData;
        // 獲取 使用者課表
        this.fetchTable();
        // 填充 展示版課表
        this.refreshTable(-1);
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
  initTable(): void {
    this.coursesOnWorkdays.length = 0;

    let tableCellData: TableCellData;
    // 星期一到五
    for (let i = 0; i < 5; ++i) {
      this.coursesOnWorkdays.push([]);
      // 一天14節課
      for (let j = 0; j < 14; ++j) {
        tableCellData = new TableCellData();
        tableCellData.time.day = i;
        tableCellData.time.start = j;
        this.coursesOnWorkdays[i].push(tableCellData);
      }
    }

    this.coursesOnOtherDays.length = 0;
  }

  /**
   * 打API 獲取 使用者課表
   */
  fetchTable(): void {
    this.tempTable.length = 0;
    //fake data
    this.tempTable.push(1730, 2059, 409, 9728);
  }

  /**
   * TODO: ecfack 初始化展示版課表，根據使用者課表 填入 展示版課表
   */
  refreshTable(previewId:number): void {
    this.initTable();
    this.credits = 0;
    for (let i = 0; i < this.tempTable.length; ++i) {
      const targetId = this.tempTable[i];
      this.addToTable(targetId, false);
    }
    // 加入預覽中課程（wishlist）
    if (previewId!==-1) {
      this.addToTable(previewId, true);
    }
    // // 加入篩選中時段
    // if (this.filtering_now.day && this.filtering_now.time) {
    //   this.markFilterCell(this.filtering_now.day, this.filtering_now.time);
    // }
  }

  /**
   * 把特定課程 加入 展示版課表
   * @param courseId 特定課程的Id
   * @param isPreviewing false：以非預覽(正式)的狀態 加入 展示版課表，true：以預覽的狀態 加入 展示版課表
   * @returns 
   */
  addToTable(courseId: number, isPreviewing: boolean): void {
    // 取得 特定課程的完整資料
    const courseItem: CourseModel | undefined = this.allCourseInNewSemester.find(course => course.id === courseId);
    if (!courseItem) {
      return;
    }
    // 把時間 轉成 可被展示版課表接受的形式
    let timeItem = TimeObject.getTimeObject(courseItem.time);
    // 如果沒撞課
    if (!this.isConflicted(courseItem, this.coursesOnWorkdays)) {

      // 計算 學分數
      if (!isPreviewing) {
        this.credits += courseItem.courseCredit;
        this.credits$.next(this.credits);
      }

      // 特定課程 加入 展示版課表
      // 如果 非平日上課時段
      if (!timeItem.length) {
        this.coursesOnOtherDays.push(courseItem);
      }
      else {
        let day, start, hrs, fillCell: TableCellData;
        // 將各起始時段 填入 展示版課表
        for (let i = 0; i < timeItem.length; ++i) {
          // console.log(time_item);
          day = timeItem[i].day;
          start = timeItem[i].start;
          hrs = timeItem[i].hrs;

          // 把當前起始時段 填入 展示版課表
          fillCell = this.coursesOnWorkdays[day][start];
          fillCell.time.hrs = hrs;
          fillCell.courseItem = courseItem;
          fillCell.cellStatusTitle = fillCell.courseItem.deptId + '-' + fillCell.courseItem.courseIndex;
          fillCell.cellStatusText = fillCell.courseItem.courseName;
          if (isPreviewing) {
            fillCell.isPreviewing = true;
          }
          // 將後續被占用時段的 time.hrs 設定為 -1
          for (let j = 1; j < hrs; ++j) {
            fillCell = this.coursesOnWorkdays[day][start + j];
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

  /**
   * 檢測 特定課程 是否撞課 在展示版課表
   * @param classItem 特定課程
   * @param tableItem 展示版課表中 平日的部分
   * @returns false：未撞課，true：已撞課
   */
  isConflicted(classItem: CourseModel, tableItem: TableCellData[][]): boolean {
    const timeItem = TimeObject.getTimeObject(classItem.time);
    // 如果 此門課程 非平日時段
    if (!timeItem) {
      return false;
    }
    let day, start, hrs;
    for (let i = 0; i < timeItem.length; ++i) {
      day = timeItem[i].day;
      start = timeItem[i].start;
      hrs = timeItem[i].hrs;

      for (let j = 0; j < hrs; ++j) {
        let checkCell = tableItem[day][start + j];

        // 如果 當前時段 被占用
        if (checkCell.time.hrs !== 0) {
          // 如果 是同一門課互撞
          if (checkCell.courseItem.id === classItem.id) {
            if (checkCell.isPreviewing) {
              return false;
            }
            else {
              return true;
            }
          }
          else {
            // 對此時在課表的課程 標記衝堂
            // console.log('checkConflict: 找到衝堂');
            if (checkCell.time.hrs > 0) {
              checkCell.cellStatusTitle = "時段衝堂";
              checkCell.isConflicted = true;
            }
            else {
              for (let k = 1; k < 15; ++k) {
                let originCell = tableItem[day][start - k];
                // console.log(origin_cell.time.hrs);
                if (originCell.time.hrs > 0) {
                  originCell.cellStatusTitle = "時段衝堂";
                  originCell.isConflicted = true;
                  break;
                }
              }
            }
            return true;
          }
        }
      }
    }
    return false;
  }

  /**
   * TODO: ecfack 從課表 移除 特定課程，並加入 願望清單
   * @param courseId 特定課程的Id
   */
  deleteItem(courseId: number): void {
    // 因為只有時段為「其他」者會用到所以寫得很簡陋
    // setNotification ( '成功移出課表！' );
    // wishlistAdd( id );
    this.removeFromTempTable(courseId);
  }

  addToTempTable( targetId:number ):void {
    this.tempTable.push( targetId );
    this.refreshTable(-1);
  }

  removeFromTempTable( targetId:number ):void {
    this.tempTable=this.tempTable.filter(courseId => courseId!==targetId)
    this.refreshTable(-1);
  }
}

/**
 * 展示版課表的 每一格資料
 */
export class TableCellData {
  // 當前占用的課程的 時間資訊
  // time.hrs：1 以上 - 該課程佔據節次數、 0 - 該節次無課程、 (-1) - 該節次已被上方課程佔據
  time: TimeObject;
  // 當前占用的課程的 課程資訊
  courseItem: CourseModel;

  // 此格 目前是否為 篩選條件
  ifFilterTime: boolean = false;
  // 占用此格的課程 目前是否為 預覽中
  isPreviewing: boolean = false;
  // 此格 目前是否 已被衝堂
  isConflicted: boolean = false;

  // 當前占用的課程的 文字資料
  cellStatusTitle: string = "篩選課程";
  cellStatusText: string = "選擇此時段";

  constructor() {
    this.courseItem = new CourseModel();
    this.time = new TimeObject();
  }
}

/**
 * 一種 課程時間的 表達形式
 */
export class TimeObject {
  // 在星期幾上課
  day: number = 0;
  // 從第幾節上課
  start: number = 0;
  // 課堂時數
  // 若 使用在 展示版課表，1 以上 - 該課程佔據節次數、 0 - 該節次無課程、 (-1) - 該節次已被上方課程佔據
  hrs: number = 0;

  /**
   * 把傳入的課程時間 轉成 TimeObject的形式
   * ex："[1]1~2 [2]1" -> [ {d:1, s:1, h:2}, {d:2, h:1, s:1} ]
   * @param courseTime 課程時間，ex："[1]2~3"
   * @returns []：傳入的課程時間 不是平日時段，其他：傳入的課程時間 轉成的 TimeObject[]
   */
  static getTimeObject(courseTime: string): TimeObject[] {
    // 正規表達式
    const RE_CHINESE = /[\u4e00-\u9fa5]/g;
    const RE_COURSE_TIME_FROM1 = /\[[0-9]\][a-zA-Z0-9]~[a-zA-Z0-9]/;
    const RE_COURSE_TIME_FROM2 = /\[[0-9]\][a-zA-Z0-9]/;
    const RE_DAY = /\[[0-9]\]/;
    const RE_NUM = /[a-zA-Z0-9]/;

    // 初始化文字
    let text = courseTime.toString();
    // 刪掉所有多餘空格
    text = text.replace(/\s+/g, '');
    // 檢測是否出現中文
    if (text.match(RE_CHINESE)) {
      // console.log('getTime: 出現中文 ');
      return [];
    }
    // 檢查是否為合理值
    if (!text.match(RE_COURSE_TIME_FROM2)) {
      // console.log('getTime: 無效的時間 ');
      return [];
    }

    // 將上課時間分段存入陣列
    let timeSplit: string[] = [], result: RegExpMatchArray;
    while (text != '') {
      if (text.match(RE_COURSE_TIME_FROM1)) {
        result = text.match(RE_COURSE_TIME_FROM1);
        text = text.replace(result[0], '');
        timeSplit.push(result[0]);
      }
      else if (text.match(RE_COURSE_TIME_FROM2)) {
        result = text.match(RE_COURSE_TIME_FROM2);
        text = text.replace(result[0], '');
        timeSplit.push(result[0]);
      }
      else {
        break;
      }
    }

    // 將陣列文字轉成排課資訊
    let day: string, time: string, start: string, end: string, hrs: number;
    let timeItem: TimeObject[] = [];
    for (let i = 0; i < timeSplit.length; ++i) {
      // 把字串切成「星期幾」和「上課節次」
      day = timeSplit[i].match(RE_DAY)[0].match(RE_NUM)[0];
      time = timeSplit[i].replace('\[' + day + '\]', '');
      // 把節次切成「開始節次」和「持續時間」
      if (time.toString().match('~')) {
        start = time[0];
        end = time[2];
        hrs = textTransTime(end) - textTransTime(start) + 1;
      }
      else {
        start = time[0];
        hrs = 1;
      }

      if (day <= '5' && day >= '1') {
        // 轉換為 time_item
        timeItem.push({
          day: parseInt(day) - 1,
          start: textTransTime(start),
          hrs: hrs
        });
      }
      else {
        return [];
      }
    }
    // console.log ( time_item );
    return timeItem;
  }
};

/**
 * 把「上課時段文字」轉成「真實時段順序」
 * @param text 上課時段文字
 * @returns 真實時段順序，即一天中的 第0~13堂課
 */
function textTransTime(text: string): number {
  let realTime: number = 0;
  if (text > '0' && text <= '4') {
    realTime = parseInt(text) - 1;
  }
  else if (text >= '5' && text <= '9') {
    realTime = parseInt(text);
  }
  else {
    switch (text) {
      case 'N':
        realTime = 4;
        break;
      case 'A':
        realTime = 10;
        break;
      case 'B':
        realTime = 11;
        break;
      case 'C':
        realTime = 12;
        break;
      case 'D':
        realTime = 13;
        break;
      default:
        realTime = 0;
        // realTime = 'other_time';
        break;
    }
  }
  return realTime;
}