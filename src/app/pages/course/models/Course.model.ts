export class CourseModel {
    /** id */
    id: number;
    /** 學分 */
    courseCredit: number;
    /** 時間 */
    time: string;
    /** 系所名稱 */
    deptName: string;
    /** 系號 */
    deptId: string;
    /** 老師 */
    teacher: string;
    /** 課程名稱 */
    courseName: string;
    /** 課程碼 */
    courseId: string;
    /** 選必修 */
    courseType: string;
    /** 選課序號 */
    courseIndex: string;
    /** 心得數量 */
    commentNum: number;
}

export class CourseRawModel {
    comment_num: number;
    id: number;
    學分: number;
    時間: string;
    系所名稱: string;
    系號: string;
    老師: string;
    課程名稱: string;
    課程碼: string;
    選必修: string;
    選課序號: string;
}

export class HistoryCourseModel {
    id: number;
    semester: string;
    deptId: string;
    teacher: string;
    courseName: string;
}

export class HistoryCourseRawModel {
    id: number; // 82912
    semester: string; // "110-1"
    系號: string; // "KZ"
    老師: string; // "林長寬*,林朝成"
    課程名稱: string; // "現代佛教、跨界及國際政治"
}
export class CourseRawModel2 {
    id: number;
    課程名稱: string;
    老師: string;
    系號: string;
}
