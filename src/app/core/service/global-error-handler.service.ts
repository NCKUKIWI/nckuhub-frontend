import { ErrorHandler, Injectable } from "@angular/core";

/**
 * 錯誤控管 service <br/>
 * 
 * @author Nick Liao
 * @date 2021/09/20
 */
 @Injectable({
    providedIn: 'root'
})
export class GlobalErrorHandler implements ErrorHandler {

     handleError(error: any): void {
        //  throw new Error("Method not implemented.");
        // TODO: error handle

        // 
     }
}