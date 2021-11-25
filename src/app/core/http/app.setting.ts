import { environment } from 'src/environments/environment';

/**
 * 系統參數設定 <br/>
 */
export class AppSettings {
    public static API_ENDPOINT = environment.appEndPoint;
    // public static PER_PAGE_NUMBER = 10;
    // public static MAX_SHOW_PAGES = '5';
    public static APP_TIME_OUT = 600000;
    // public static SUCCESS_CODE = '0000';
    // public static FAIL_CODE = '9001';
    // public static AUTH_ERROR_CODE = '9995';
}

/**
 * 應用程式URL清單設定 <br/>
 */
export class AppUrl {
    public static USER_LOGIN_PAGE_URL = '/login';
    public static LOGIN_USER_URL = '/oauth/token';
    public static USER_TOKEN_FAIL_URL = environment.logoutUrl;
    public static USER_LOGOUT_URL = '/user/logout';
    public static USER_LOGOUT_REDIRECT_URL = environment.logoutUrl;

    /** Course 課程 */
    /** 取得 課程 當學期資料 */
    public static GET_CURRENT_SEMESTER_COURSE = (): string => '/course';
    /** 取得 課程 系所資料 */
    public static GET_COURSE_DEPT_INFO = (): string => '/course/allDpmt';
    /** 取得 課程 歷史資料 */
    public static GET_HISTORY_COURSE = (): string => '/course/allCoursePrev';
    /** 取得 課程 某一筆資料 */
    public static GET_ONE_COURSE = (courseId: number): string => `/course/${courseId}`;

    /** User 使用者 */
    /** 取得 使用者 課表、願望清單資訊 */
    public static GET_USER_TABLE_WISHLIST = (userId: number): string => `/user/getList/${userId}`;
    /** 取得 使用者 個人資料 */
    public static GET_USER_INFO = (): string => '/user/info';
    /** 取得 使用者 小幫手狀態 */
    public static GET_HELPER_STATUS = (): string => `/user/findHelperService`;
    /** 修改 使用者 課表 */
    public static SET_TABLE = (userId: number): string => `/post/setTable/${userId}`;
    /** 修改 使用者 願望清單 */
    public static SET_WISHLIST = (userId: number): string => `/post/setWish/${userId}`;
}

/**
 * 應用程式訊息設定 <br/>
 */
export class AppMessages {
    public static PROMPT_SUCCESS_MES = '執行成功';
    public static PROMPT_ERROR_MES = '執行失敗';
    public static PROMPT_CONFIRM_MES = '是否確認？';
    public static PROMPT_CANCEL_CHECK_MES = '是否確認取消？';
    public static PROMPT_LOGOUT_CONFIRM_MES = '是否確認登出？';
    public static PROMPT_EMPTY_MES = '未選擇選項';
    public static PROMPT_AUTH_FAIL_MES = '認證失敗';
    public static PROMPT_PERMISSION_FAIL_MES = '權限不足';
    public static PROMPT_SEARCH_NULL_MES = '請輸入查詢條件';
    public static PROMPT_FAIL_VALIDATE_FORM = '輸入欄位有誤';
    public static PROMPT_NOT_YET_SAVE = '表單尚未儲存';
    public static PROMPT_NO_DATA_MES = '查無資料';
}
