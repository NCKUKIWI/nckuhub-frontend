/**
 * StringUtils
 *
 * @version 1.0, Feb 12, 2019
 */
 export class StringUtils {

    private static _constructor = (() => {
        // alert('StringUtils Static constructor');
    })();

    /** HTML escape chars */
    private static escapeChars: { [key: string]: string } = {
        '¢': 'cent',
        '£': 'pound',
        '¥': 'yen',
        '€': 'euro',
        '©': 'copy',
        '®': 'reg',
        '<': 'lt',
        '>': 'gt',
        '"': 'quot',
        '&': 'amp',
        '\'': '#39'
    };

    /** HTML entities */
    private static htmlEntities: { [key: string]: string } = {
        nbsp: ' ',
        cent: '¢',
        pound: '£',
        yen: '¥',
        euro: '€',
        copy: '©',
        reg: '®',
        lt: '<',
        gt: '>',
        quot: '"',
        amp: '&',
        apos: '\''
    };

    /**
     * 中文 regex
     */
    private static regexChinese = new RegExp(/[\u4e00-\u9fa5]/g);

    /**
     * 預設空白
     */
    private static defaultToWhiteSpace(characters: string) {
        if (characters === undefined) {
            return '\\s';
        } else {

            return '[' + StringUtils.escapeRegExp(characters) + ']';
        }
    }

    /**
     * regular expression for escape char
     */
    private static escapeRegExp(str: Object) {
        return StringUtils.makeString(str).replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');

    }

    /**
     * to positive
     */
    private static toPositive(num: number): number {
        return num < 0 ? 0 : (+num || 0);
    }

    /**
     * Ensure some object is a coerced to a string
     */
    private static makeString(object: any) {
        if (object === undefined || object === null) {
            return '';
        }
        return '' + object;
    }


    /**
     * Converts entity characters to HTML equivalents.
     * This function supports cent, yen, euro, pound, lt, gt, copy, reg, quote, amp, apos, nbsp.
     * <pre>
     *  unescapeHTML("&lt;div&gt;Blah&nbsp;blah blah&lt;/div&gt;"); // => "<div>Blah blah blah</div>"
     * </pre>
     */
    public static unescapeHTML(str: string): string {


        return StringUtils.makeString(str).replace(/\&([^;]+);/g, function (entity, entityCode) {
            let match: string;

            if (entityCode in StringUtils.htmlEntities) {
                return StringUtils.htmlEntities[entityCode];
                /*eslint no-cond-assign: 0*/
            } else if (match = entityCode.match(/^#x([\da-fA-F]+)$/)) {
                return String.fromCharCode(parseInt(match[1], 16));
                /*eslint no-cond-assign: 0*/
            } else if (match = entityCode.match(/^#(\d+)$/)) {
                return String.fromCharCode(Math.floor(parseInt(match[1], 10)));
            } else {
                return entity;
            }
        });

    }

    /**
     * <pre>
     *  insert("Hellworld", 4, "o "); // => "Hello world"
     * </pre>
     */
    public static insert(str: string, i: number, substr: string): string {
        return StringUtils.splice(str, i, 0, substr);
    }

    /**
     * <pre>
     *  splice("https://edtsech@bitbucket.org/edtsech/underscore.strings", 30, 7, "epeli");
     *  // => "https://edtsech@bitbucket.org/epeli/underscore.strings"
     * </pre>
     */
    public static splice(str: string, i: number, howmany: number, substr: string): string {
        const arr: string[] = StringUtils.chars(str);

        arr.splice(i, howmany, substr);
        return arr.join('');
    }

    /**
     * Split lines to an array
     * <pre>
     *  lines("Hello\nWorld"); // => ["Hello", "World"]
     * </pre>
     */
    public static lines(str: string): string[] {
        if (str == null) {
            return [];
        }
        return String(str).split(/\r\n?|\n/);
    }

    /**
     * Return reversed string:
     * <pre>
     *  reverse("foobar"); // => "raboof"
     * </pre>
     */
    public static reverse(str: string): string {
        return StringUtils.chars(str).reverse().join('');
    }

    /**
     * checks whether the string begins with starts at position (default: 0).
     * <pre>
     *  startsWith("image.gif", "image"); // => true
     *  startsWith(".vimrc", "vim", 1);   // => true
     * </pre>
     */
    public static startsWith(str: string, starts: string, position?: number): boolean {
        str = StringUtils.makeString(str);
        starts = '' + starts;
        position = (position === undefined) ? 0 : Math.min(StringUtils.toPositive(position), str.length);
        return str.lastIndexOf(starts, position) === position;
    }

    /**
     * This method checks whether the string ends with ends at position (default: string.length).
     * <pre>
     *  endsWith("image.gif", "gif");           // => true
     *  endsWith("image.old.gif", "old", 9);    // => true
     * </pre>
     */
    public static endsWith(str: string, ends: string, position?: number): boolean {
        str = StringUtils.makeString(str);
        ends = '' + ends;
        if (position === undefined) {
            position = str.length - ends.length;
        } else {
            position = Math.min(StringUtils.toPositive(position), str.length) - ends.length;
        }
        return position >= 0 && str.indexOf(ends, position) === position;
    }

    /**
     * <pre>
     *  titleize("my name is epeli"); // => "My Name Is Epeli"
     * </pre>
     */
    public static titleize(str: string): string {
        return StringUtils.makeString(str).toLowerCase().replace(/(?:^|\s|-)\S/g, function (c) {
            return c.toUpperCase();
        });
    }

    /**
     * Trims defined characters from begining and ending of the string. Defaults to whitespace characters.
     * <pre>
     *  trim("  foobar   ");        // => "foobar"
     *  trim("_-foobar-_", "_-");   // => "foobar"
     * </pre>
     */
    public static trim(str: string, characters?: string): string {

        str = StringUtils.makeString(str);

        if (characters === undefined) {
            return str.trim();
        }

        characters = StringUtils.defaultToWhiteSpace(characters);
        return str.replace(new RegExp('^' + characters + '+|' + characters + '+$', 'g'), '');
    }

    /**
     * 去掉左邊空白
     */
    public static ltrim(str: string, characters?: string): string {
        str = StringUtils.makeString(str);

        characters = StringUtils.defaultToWhiteSpace(characters);
        return str.replace(new RegExp('^' + characters + '+'), '');

    }

    /**
     * 去掉右邊空白
     */
    public static rtrim(str: string, characters?: string): string {
        str = StringUtils.makeString(str);

        characters = StringUtils.defaultToWhiteSpace(characters);
        return str.replace(new RegExp(characters + '+$'), '');
    }

    /**
     * <pre>
     *  truncate("Hello world", 5); // => "Hello..."
     *  truncate("Hello", 10);      // => "Hello"
     * </pre>
     */
    public static truncate(str: string, length: number, truncateStr?: string) {
        str = StringUtils.makeString(str);

        truncateStr = truncateStr || '...';

        return str.length > length ? str.slice(0, length) + truncateStr : str;
    }

    /**
     * <pre>
     *  strRight("This_is_a_test_string", "_");  // => "is_a_test_string"
     * </pre>
     */
    public static strRight(str: string, sep: string): string {
        str = StringUtils.makeString(str);
        sep = StringUtils.makeString(sep);
        const pos: number = (sep === undefined) ? -1 : str.indexOf(sep);
        return (pos >= 0) ? str.slice(pos + sep.length, str.length) : str;
    }

    /**
     * <pre>
     *  strRightBack("This_is_a_test_string", "_"); // => "string"
     * </pre>
     */
    public static strRightBack(str: string, sep: string): string {
        str = StringUtils.makeString(str);
        sep = StringUtils.makeString(sep);
        const pos: number = (sep === undefined) ? -1 : str.lastIndexOf(sep);
        return (pos >= 0) ? str.slice(pos + sep.length, str.length) : str;
    }

    /**
     * <pre>
     *  strLeft("This_is_a_test_string", "_"); // => "This";
     * </pre>
     */
    public static strLeft(str: string, sep: string): string {
        str = StringUtils.makeString(str);
        sep = StringUtils.makeString(sep);
        const pos: number = (sep === undefined) ? -1 : str.indexOf(sep);
        return (pos >= 0) ? str.slice(0, pos) : str;
    }

    /**
     * <pre>
     *  strLeftBack("This_is_a_test_string", "_"); // => "This_is_a_test";
     * </pre>
     */
    public static strLeftBack(str: string, sep: string): string {
        str = StringUtils.makeString(str);
        sep = StringUtils.makeString(sep);
        const pos: number = str.lastIndexOf(sep);
        return (pos >= 0) ? str.slice(0, pos) : str;
    }

    /**
     * <pre>
     *  stripTags("a <a href=\"#\">link</a>"); // => "a link"
     * </pre>
     */
    public static tripTags(str: string): string {
        return StringUtils.makeString(str).replace(/<\/?[^>]+>/g, '');
    }

    /**
     * <pre>
     *  surround("foo", "ab"); // => "abfooab"
     * </pre>
     */
    public static surround(str: string, wrapper: string) {
        return [wrapper, str, wrapper].join('');
    }

    /**
     * <pre>
     *  quote("foo", '"'); // => '"foo"';
     * </pre>
     */
    public static quote(str: string, quoteChar?: string): string {
        return StringUtils.surround(str, quoteChar || '"');
    }

    /**
     * <pre>
     *  replaceAll("foo", "o", "a"); // => "faa"
     * </pre>
     */
    public static replaceAll(str: string, find: string, replace: string, ignorecase?: boolean): string {

        const flags: string = (ignorecase === true) ? 'gi' : 'g';
        const reg: RegExp = new RegExp(find, flags);

        return StringUtils.makeString(str).replace(reg, replace);
    }

    /**
     * Converts HTML special characters to their entity equivalents.
     * This function supports cent, yen, euro, pound, lt, gt, copy, reg, quote, amp, apos.f
     */
    public static escapeHTML(str: string): string {

        let regexString = '[';

        for (const key in StringUtils.escapeChars) {
            if (StringUtils.escapeChars.hasOwnProperty(key)) {
                regexString += key;
            }
        }
        regexString += ']';

        const regex = new RegExp(regexString, 'g');


        return StringUtils.makeString(str).replace(regex, function (m) {
            return '&' + StringUtils.escapeChars[m] + ';';
        });

    }

    /**
     * 判斷是否為空物件
     * <pre>
     *  @param val : 物件
     *  @return boolean : 空值為true, 有值為false
     * </pre>
     */
    public static isEmptyObj<T>(val: T): boolean {
        if (val === undefined) {
            return true;
        }
        if (val == null) {
            return true;
        }
        return false;
    }

    /**
     * 判斷是否為空字串
     * <pre>
     *  @param val : 字
     *  @return boolean : 空值為true, 有值為false
     * </pre>
     */
    public static isEmptyStr(val: string): boolean {
        const isEmptyObj = this.isEmptyObj(val);
        if (true === isEmptyObj) {
            return isEmptyObj;
        }
        if (val.trim().length === 0) {
            return true;
        }
        return false;
    }

    /**
     * <pre>
     *  trimToEmpty(undefined); => ""
     *  trimToEmpty(" a "); => "a"
     * </pre>
     */
    public static trimToEmpty(str: string): string {

        str = StringUtils.makeString(str);

        return StringUtils.trim(str);
    }

    /**
     * 取得字串長度
     * <pre>
     *  length(undefined); => 0
     * </pre>
     *
     * 不能取名叫length
     */
    public static strLen(str: string): number {

        str = StringUtils.makeString(str);

        return str.length;
    }

    /**
     * 兩字串是否相同(大小寫視為不同)
     * @param s1
     * @param s2
     * <pre>
     *  equals(undefined, undefined); => true
     *  equals(undefined, ""); => false
     *  equals("A", "a"); => false
     * </pre>
     */
    public static equals(s1: string, s2: string): boolean {
        return s1 === s2;
    }

    /**
     * 兩字串先分別trimToEmpty,再比對是否相同(大小寫視為不同)
     * @param s1
     * @param s2
     * <pre>
     *  trimEquals(undefined, undefined); => true
     *  trimEquals(" A  ", "A"); => true
     *  trimEquals("A", "a"); => false
     * </pre>
     */
    public static trimEquals(s1: string, s2: string): boolean {
        s1 = StringUtils.trimToEmpty(s1);
        s2 = StringUtils.trimToEmpty(s2);
        return s1 === s2;
    }

    /**
     * 是否為數字
     *
     */
    public static isNumeric(s: string): boolean {
        const value: number = Number(s);

        return !isNaN(value);

    }

    /**
     * 兩字串是否相同(大小寫視為相同)
     * <pre>
     *  equalsIgnoreCase(undefined, undefined); => true
     *  equalsIgnoreCase(undefined, ""); => false
     *  equalsIgnoreCase("A", "a"); => true
     * </pre>
     */
    public static equalsIgnoreCase(s1: string, s2: string): boolean {

        if (s1 === s2) {
            return true;
        }
        if ((s1 === undefined) || (s2 === undefined)) {
            return false;
        }
        return StringUtils.toLowerCase(s1) === StringUtils.toLowerCase(s2);
    }

    /**
     * <pre>
     *  split("2:3:4:5", ":")  => ["2", "3", "4", "5"]
     * </pre>
     */
    public static split(str: string, sep: string, howmany?: number): string[] {

        if (str === undefined) {
            return [];
        }

        return str.split(sep, howmany);
    }

    /**
     * 從start開始(包括start)到end結束(不包括end)
     * <pre>
     *  slice("0123456", 2, 5); => "234"
     * </pre>
     */
    public static slice(str: string, start: number, end?: number): string {
        if (str === undefined) {
            return '';
        }

        return str.slice(start, end);
    }

    /**
     * <pre>
     *  substring("0123456", 2, 5); => "234"
     * </pre>
     */
    public static substring(str: string, start: number, end?: number): string {
        if (str === undefined) {
            return '';
        }

        return str.substring(start, end);
    }

    /**
     * <pre>
     *  right("0123456", 2); => "56"
     * </pre>
     */
    public static right(str: string, len: number): string {
        if (str === undefined) {
            return '';
        }

        return StringUtils.substring(str, str.length - len);

    }

    /**
     * <pre>
     *  left("0123456", 2); => "01"
     * </pre>
     */
    public static left(str: string, len: number): string {
        if (str === undefined) {
            return '';
        }

        return StringUtils.substring(str, 0, len);

    }

    /**
     * <pre>
     *  toLowerCase(undefined); => ""
     *  toLowerCase("Abc"); => "abc"
     * </pre>
     */
    public static toLowerCase(str: string): string {
        if (str === undefined) {
            return '';
        }

        return str.toLowerCase();
    }

    /**
     * <pre>
     *  toUpperCase(undefined); => ""
     *  toUpperCase("Abc"); => "ABC"
     * </pre>
     */
    public static toUpperCase(str: string): string {
        if (str === undefined) {
            return '';
        }

        return str.toUpperCase();
    }

    /**
     * <pre>
     *  indexOf("Hello world!", "Hello"); => 0
     *  indexOf("Hello world!", "World"); => -1
     *  indexOf("Hello world!", "world"); => 6
     * </pre>
     */
    public static indexOf(str: string, searchValue: string, fromIndex?: number): number {
        if (str === undefined) {
            return -1;
        }

        return str.indexOf(searchValue, fromIndex);
    }

    /**
     * <pre>
     *  indexOf("Hello world!", "Hello"); => 0
     *  indexOf("Hello world!", "World"); => -1
     *  indexOf("Hello world!", "world"); => 6
     * </pre>
     */
    public static lastIndexOf(str: string, searchValue: string, fromIndex?: number): number {
        if (str === undefined) {
            return -1;
        }

        return str.lastIndexOf(searchValue, fromIndex);
    }

    /**
     * <pre>
     *  isBlank("");     // => true
     *  isBlank("\n");   // => true
     *  isBlank(" ");    // => true
     *  isBlank("a");    // => false
     * </pre>
     */
    public static isBlank(str: string): boolean {
        return (/^\s*$/).test(StringUtils.makeString(str));
    }

    /**
     *
     */
    public static isNotBlank(str: string): boolean {
        return !StringUtils.isBlank(str);
    }

    /**
     * 將字串第一個字母轉為大寫
     *
     * @param str
     * @param lowercaseRest: If true is passed as second argument the rest of the string will be converted to lower case.
     *
     * <pre>
     *  capitalize("foo Bar"); // => "Foo Bar"
     *  capitalize("FOO Bar", true); // => "Foo bar"
     * </pre>
     */
    public static capitalize(str: string, lowercaseRest?: boolean): string {
        str = StringUtils.makeString(str);

        lowercaseRest = (lowercaseRest === undefined) ? false : true;

        const remainingChars = !lowercaseRest ? str.slice(1) : str.slice(1).toLowerCase();

        return str.charAt(0).toUpperCase() + remainingChars;
    }

    /**
     * 將字串第一個字母轉為小寫
     *
     * @param stR
     *
     * <pre>
     *  decapitalize("Foo Bar"); // => "foo Bar"
     * </pre>
     */
    public static decapitalize(str: string): string {
        str = StringUtils.makeString(str);
        return str.charAt(0).toLowerCase() + str.slice(1);
    }

    /**
     * <pre>
     *  chars("Hello"); // => ["H", "e", "l", "l", "o"]
     * </pre>
     */
    public static chars(str: string): string[] {
        return StringUtils.makeString(str).split('');
    }

    /**
     * <pre>
     *     getTokens("AAABBBCCC",3); // => ["AAA","BBB","CCC"]
     * </pre>
     */
    public static getTokens(str: string, len: number): string[] {
        const tokens: string[] = [];
        let iLeft = 0;
        const iDataLen: number = str.length;
        while (iLeft < iDataLen) {
            const iRight: number = (iLeft + len) > iDataLen ? iDataLen : iLeft + len;
            const sToken: string = str.substring(iLeft, iRight);
            iLeft += len;
            tokens.push(sToken);
        }
        return tokens;
    }

    /**
     * Tests if string contains a substring.
     * <pre>
     *  include("foobar", "ob"); // => true
     * </pre>
     */
    public static include(str: string, needle: string): boolean {
        if (needle === '') {
            return true;
        }

        return StringUtils.makeString(str).indexOf(needle) !== -1;
    }


    /**
     * Returns number of occurrences of substring in string.
     * <pre>
     *  count("Hello world", "l"); // => 3
     * </pre>
     */
    public static(str: string, substr: string): number {
        str = StringUtils.makeString(str);
        substr = StringUtils.makeString(substr);

        if (str.length <= 0 || substr.length <= 0) {
            return 0;
        }

        return str.split(substr).length - 1;
    }

    /**
     * 字串補滿長度
     * leftPad('abc', 5, 'd'), return 'ddabc'
     */
    public static leftPad(str: string, len: number, pad?: string): string {
        str = StringUtils.makeString(str);
        if (this.isEmptyObj(str) || str.length >= len) {
            return str;
        }

        if (this.isEmptyObj(pad)) {
            pad = '0';
        } else if (pad.length > 1) {
            pad = pad.substring(0, 1);
        }

        let paddingStr = '';
        for (let i = 0; i < len - str.length; i++) {
            paddingStr += pad;
        }
        return paddingStr + str;
    }

    /**
    * 半形轉全形
    */
    public static toFullWidth(str: string) {
        if (!str) return '';
        var ascii = '';
        for (let i = 0, l = str.length; i < l; i++) {
            let charCode = str[i].charCodeAt(0);
            if (charCode <= 126 && charCode >= 33) {
                charCode += 65248;
            } else if (charCode == 32) { // 半形空白轉全形
                charCode = 12288;
            }
            ascii += String.fromCharCode(charCode);
        }
        return ascii;
    }

    /**
    * 全形轉半形
    */
    public static toHalfWith(str: string) {
        if (!str) return;
        var ascii = '';
        for (var i = 0, l = str.length; i < l; i++) {
            var c = str[i].charCodeAt(0);

            // make sure we only convert half-full width char
            if (c >= 0xFF00 && c <= 0xFFEF) {
                c = 0xFF & (c + 0x20);
            }

            // space transfer
            if(c == 0x20){
                ascii += String.fromCharCode(32); 
            }
            else {
                ascii += String.fromCharCode(c);
            } 

        }
        return ascii;
    }


    /**
     * 判斷全形(中文、英文、標點符號)
     */
    public static isFullWidth(str: string): boolean{
        return /^[\u4E00-\u9FFF|\uFF01-\uFF5E|\u3000\u3001-\u303F]+$/g.test(str);
    }

    /**
     * 判斷全形
     */
    public static isHalfWidth(str: string): boolean{
        return /[\u0000-\u00ff]/g.test(str);
    }

    /**
     * 判斷中文
     * @param str
     */
    public static isChinese(str: string): boolean{
        return this.regexChinese.test(str);
    }

    /**
     * 是否為 特殊符號
     * @param str 
     */
    public static isSpecialChar(str: string): boolean{
        // 去除中文字
        const withoutChinese = str.replace(this.regexChinese, "");
        // 找出非英文數字
        return /\W+/g.test(withoutChinese);
    }

    public static appendIfMissing(str: string, missingStr: string): string{
        if(str && !this.isEmptyStr(str) && !this.endsWith(str, missingStr)){
            return str + missingStr;
        }
        return str ?? '';
    }

    public static prependIfMissing(str: string, missingStr: string): string{
        if(str && !this.isEmptyStr(str) && !this.startsWith(str, missingStr)){
            return missingStr + str;
        }
        return str ?? '';
    }
}
