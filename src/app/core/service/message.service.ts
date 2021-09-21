import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AppMessages } from '../http/app.setting';

/**
 * 訊息控管 Service <br/>
 * 
 * @author Nick Liao
 * @date 2021/09/20
 */
@Injectable({
  providedIn: 'root'
})
export class MessageService {

    private validateResultSource = new Subject<any>();

    validateResultSource$ = this.validateResultSource.asObservable();

    // TODO message type (using enum ??) ??

    constructor() { }

    popUpValidateResult(response : Response, context : {
        response? : Response
        warningClick? : Function,
        errorClick? : Function
    } = {}) {
        context.response = response;
        this.validateResultSource.next(context);
    }

//   confirm(confirmation : Confirmation) {
    // this.confirmationService.confirm(confirmation);
//   }

    error(context : {
        message : string,
        accept : Function
    }) {
        const confirm = Object.assign({
        message: context.message,
        header:'錯誤訊息',
        rejectVisible:false,
        acceptVisible:true,
        acceptLabel :'確認'
        }, context);

        // this.confirmationService.confirm(confirm);
    }

    areYouSure(context : {
        message? : string,
        accept : Function,
        reject? : Function
    }) {

        const confirm = Object.assign({
        message: AppMessages.PROMPT_CONFIRM_MES,
        header:'提示訊息',
        rejectVisible:true,
        acceptVisible:true,
        acceptLabel :'確認',
        rejectLabel : '取消',
        }, context);

        // this.confirmationService.confirm(confirm);
    }

    areYouSureCancel(context : {
        message? : string,
        accept : Function,
        reject? : Function
    }) {

        const confirm = Object.assign({
        message: AppMessages.PROMPT_CANCEL_CHECK_MES,
        header:'提示訊息',
        rejectVisible:true,
        acceptVisible:true,
        acceptLabel :'確認',
        rejectLabel : '取消',
        }, context);

        // this.confirmationService.confirm(confirm);
    }

    alert(context? : {
        message? : string,
        accept? : Function
    }) {
        this.executeDone(context);
    }

    executeDone(context? : {
        message? : string,
        accept? : Function
    }) {

    const confirm = Object.assign({
      message: AppMessages.PROMPT_SUCCESS_MES,
      header:'提示訊息',
      rejectVisible:false,
      acceptVisible:true,
      acceptLabel :'確認'
    }, context);

    // this.confirmationService.confirm(confirm);

  }

}
