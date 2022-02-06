import { CourseModel } from "./Course.model";

/**
 * 課表的相關資訊
 */
export class TimetableInfo {
    constructor(public displayedTableWorkdays: TableCellData[][],   // 平日時段的 展示版課表
                public displayedTableOtherDays: CourseModel[],      // 非平日時段的 展示板課表
                public tempUserTable: number[],                     // 使用者課表
                public credits: number,                             // 當前學分數
                public timeFilter:TimeObject|null) { }              // 當前時間篩選條件
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
    isFilterTime: boolean = false;
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
        const RE_COURSE_TIME_FROM1 = /\[[1-5]\][A-DN1-9]~[A-DN1-9]/;
        const RE_COURSE_TIME_FROM2 = /\[[1-5]\][A-DN1-9]/;
        const RE_DAY = /\[[1-5]\]/;
        const RE_NUM = /[A-DN1-9]/;

        // 初始化文字
        let text = courseTime.toString().toUpperCase();
        // 刪掉 所有多餘空格
        text = text.replace(/\s+/g, '');
        // 檢測 是否 出現 中文
        if (text.match(RE_CHINESE)) {
            // console.log('getTime: 出現中文 ');
            return [];
        }
        // 檢查 是否為 合理值
        if (!text.match(RE_COURSE_TIME_FROM2)) {
            // console.log('getTime: 無效的時間 ');
            return [];
        }

        // 將上課時間 分段存入 陣列
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

        // 將陣列中的文字 轉成 排課資訊
        let day: string, time: string, start: string, end: string, hrs: number;
        let timeItem: TimeObject[] = [];
        for (let classTime of timeSplit) {
            // 把字串 切成 「星期幾」和「上課節次」
            day = classTime.match(RE_DAY)[0].match(RE_NUM)[0];
            time = classTime.replace('\[' + day + '\]', '');
            // 把節次 切成 「開始節次」和「持續時間」
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
}

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