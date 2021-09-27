import { HttpHeaders, HttpParams } from "@angular/common/http";

export class Request {
    constructor(public header: NckuhubHeader,
        public model: string,
        public paging: Paging,
        public requestModel) {

    }
}

export class NckuhubHeader {
    public msgNo: string;
    public operatorCode : string;
    public senderCode : string;
    public receiverCode : string;
    public txnCode : string;
    public txnTime : string;
    public unitCode : string;
    public authorizerCode : String;
}

export class Response {
    
    public model: any;
    public paging: Paging;
    public responseTime : Date; //for search time field
    public resultCode : string; 
    public resultModel : any;
    public resultDescription : string; 
    public errorMessages : Array<string>; 
    public warningMessages : Array<string>;
    public alertMessages: Array<string>;
}

export class ResponseLogin {
    public access_token: string;
    public expires_in: number;
    public refresh_token: string;
    public jti: string;
    public start_time : Date;
    public end_time : Date;
}

export class NckuhubRequest {
    
    public model: string;
    public paging: Paging;
    
    constructor(model, paging){
        this.model = model;
        this.paging = paging;
    }
}

export class NckuhubResponse {
    public model: any;
    public paging: Paging;
}

export class Paging {
    public pageNumber : any;
    public pageSize: any;
    public totalPages : any;
    public totalCount : any;

    constructor(pageNumber, pageSize){
        this.pageNumber = pageNumber;
        this.pageSize = pageSize;
    }
}

export class PagingSort {
    property: string;
    direction: string;

    constructor(property, direction){
        this.property = property;
        this.direction = direction;
    }
}


export interface AppRequestContext {
    url: string;
    // body 資料
    body?: any;
    // param
    param?: HttpParams;
    // loading動畫
    autoLoading?: boolean;
    // 分頁用
    paging?: Paging;
}