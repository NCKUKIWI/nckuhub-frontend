import { FormControl, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";

export interface ValidatorResponse extends ValidationErrors {
    [key : string] : ErrorMessage;
}

export interface ErrorMessage {
    message? : string;
}

export class ValidateUtils {
    static conditionalValidator(predicate, validator) : ValidatorFn {
        return ((formControl : FormControl) : ValidatorResponse => {
            if (!formControl.parent) {
                return null;
            }
            if (predicate()) {
                return validator(formControl);
            }
            return null;
        });
    }

    static dateRange(limitYear: number): ValidatorFn {
        return (control: FormControl): ValidatorResponse => {
            let requestModel: any = {};
            const dateRange = control.value;
            if (control.value != null) {
                // TODO: 替換moment.js
                // requestModel.startDate = moment(dateRange[0]);
                // requestModel.endDate = dateRange[1] === null ? requestModel.startDate : moment(dateRange[1]);
                // return (moment.duration(requestModel.endDate.diff(requestModel.startDate)).asYears()) <= limitYear ? null : {
                //     'error': {
                //         message: `資料區間請設定於${limitYear}年以內`
                //     }
                // };
                return null;
            }
        }
    }
    static inputLength(limitLength: number): ValidatorFn {
        return (control: FormControl): ValidatorResponse => {
            const inputValue = control.value;
            if (inputValue != null) {
                return inputValue.length <= limitLength ? null : {
                    'error': {
                        message: `輸入字數需在${limitLength}字以內`
                    }
                };
            }
        }
    }

    static required(control : FormControl) : ValidatorResponse {
        return Validators.required(control) == null ? null : {
            'required' : {
                message : '必輸欄位'
            }
        };
    }

    static requiredNotNull(control : FormControl) : ValidatorResponse {
        return Validators.nullValidator(control) == null ? null : {
            'required': {
                message: '必輸欄位'
            }
        };
    }

    static requiredY(control : FormControl) : ValidatorResponse {
        return (Validators.required(control) == null && control.value === 'Y') ? null : {
            'required' : {
                message : '必輸欄位'
            }
        };
    }

    static pattern(pattern: string | RegExp) : ValidatorFn {
        return (control : FormControl) : ValidatorResponse => {
            return Validators.pattern(pattern)(control) == null ? null : {
                'pattern': {message:`欄位格式錯誤`}
            }
        }
    }

    static max(max : number) : ValidatorFn {
        return (control : FormControl) : ValidatorResponse => {
            return Validators.max(max)(control) == null ? null : {
                'max' : {message : `最大數值為${max}, 輸入數值為${control.value}`}
            }
        }
    }

    static maxLength(max : number) : ValidatorFn {
        return (control : FormControl) : ValidatorResponse => {
            return Validators.maxLength(max)(control) == null ? null : {
                'max' : {message : `最大長度為${max}, 輸入長度為${control.value.length}`}
            }
        }
    }

    static min(min : number) : ValidatorFn {
        return (control : FormControl) : ValidatorResponse => {
            return Validators.min(min)(control) == null ? null : {
                'min' : {message : `最小數值為${min}, 輸入數值為${control.value}`}
            }
        }
    }

    static number(integer: number, decimal: number): ValidatorFn {
      return (control : FormControl) : ValidatorResponse => {
        const regExp:RegExp = new RegExp('^\\d{1,' + integer + '}(\\.\\d{1,'+ decimal +'})?$');
        return control.value === null || control.value === '' || regExp.test(control.value) ? null : {
            'regExp' : {message : `輸入格式為數字${integer}位，小數${decimal}位, 輸入數值為${control.value}`}
        }
    }
    }

    static greaterThan(num: number): ValidatorFn{
        return (control : FormControl) : ValidatorResponse => {
            const inputValue = control.value;
            return (inputValue == null || inputValue.length == 0 || inputValue > num) ? null : {
                'greaterThan' : {message : `輸入值須大於${num}, 輸入數值為${control.value}`}
            }
        }
    }

    static minLength(min : number) : ValidatorFn {
        return (control : FormControl) : ValidatorResponse => {
            return Validators.minLength(min)(control) == null ? null : {
                'minLength' : {message : `最小長度為${min}, 輸入長度為${control.value.length}`}
            }
        }
    }

    // Validates 身分證字號
    static idnoValidator(idStr: FormControl): any {
        if (idStr.value == null || idStr.value === '') {
            return null;
        }
        // 依照字母的編號排列，存入陣列備用。
        const letters = new Array('A', 'B', 'C', 'D',
        'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M',
        'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V',
        'X', 'Y', 'W', 'Z', 'I', 'O');
        // 儲存各個乘數
        const multiply = new Array(1, 9, 8, 7, 6, 5, 4, 3, 2, 1, 1);
        // var multiply = new Array(1, 9, 8, 7, 6, 5, 4, 3, 2, 1);
        let nums = new Array(2);
        let firstChar;
        let firstNum;
        let lastNum;
        let total = 0;

        // 撰寫「正規表達式」。第一個字為英文字母，
        // 第二個字為1或2，後面跟著8個數字，不分大小寫。
        const regExpID=/^[A-Z](1|2)\d{8}$/i;

        // 使用「正規表達式」檢驗格式
        if (!regExpID.test(idStr.value)) {
            // 基本格式錯誤
            return {pattern: {message:`身分證字號欄位格式錯誤`}};
        } else {
            // 取出第一個字元和最後一個數字。
            firstChar = idStr.value.charAt(0).toUpperCase();
            lastNum = idStr.value.charAt(9);
        }
        // 找出第一個字母對應的數字，並轉換成兩位數數字。
        for (let i=0; i<26; i++) {
            if (firstChar === letters[i]) {
                firstNum = i + 10;
                nums[0] = Math.floor(firstNum / 10);
                nums[1] = firstNum - (nums[0] * 10);
                break;
            }
        }

        // 執行加總計算
        for(let i=0; i<multiply.length; i++){
            if (i < 2) {
                total += nums[i] * multiply[i];
            } else {
                total += parseInt(idStr.value.charAt(i-1)) * multiply[i];
            }
        }

        // 加總後餘數為0則為正確
        if ((total % 10) !== 0) {
            return {pattern: {message:`身分證字號欄位格式錯誤`}};
        }

        // 和最後一個數字比對
        // if ((10 - (total % 10)) % 10 != lastNum) {
        //     return {pattern: {message:`身分證字號欄位格式錯誤`}};
        // }

        return null;
    }

    static email(control : FormControl) : ValidatorResponse{
      const value = control.value;

      if(value === null || value === ''){
        return null;
      }

      const format = /^[\w-]+([\.+][\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(value);

      if(!format){
        return { 'email' : {message : '請輸入正確的Email'}};
      }

      if(value.toLowerCase().includes('@rakuten-bank.com.tw')){
        return { 'email' : {message : '不得輸入樂天銀行行員Email'}};
      }

      return null;
    }

    // Validates 統編
    // https://lindsay.pixnet.net/blog/post/22395971
    static companyNumberValidator(idvalue : FormControl) {
        if (idvalue.value == null || idvalue.value == '') {
            return null;
        }

        var tmp = new String("12121241");
        var sum = 0;
        const re = /^\d{8}$/;

        if (!re.test(idvalue.value)) {
            return {
                pattern: {message:`統一編號欄位格式錯誤`}
            };
        } else {
            for (let i=0; i< 8; i++) {
                let s1 = parseInt(idvalue.value.substr(i,1));
                let s2 = parseInt(tmp.substr(i,1));
                sum += cal(s1*s2);
            }

            let p = (sum % 10 == 0)?true:false
            let q = ((sum+1) % 10 == 0)?true:false

            if (!p) {
                if (idvalue.value.substr(6,1)=="7") {
                    if (!q) {
                        return {
                            pattern: {message:`統一編號欄位格式錯誤`}
                        };
                    }

                    return null;
                }
            }
            if (!p) {
                return {
                    pattern: {message:`統一編號欄位格式錯誤`}
                };
            }
            return null;
        }
    }
}

function cal(n : number) {
    var sum=0;
    while (n != 0) {
       sum += (n % 10);
       n = (n - n % 10) / 10;  // 取整數
      }
    return sum;
 }
