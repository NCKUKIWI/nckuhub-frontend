import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AppMessages } from '../http/app.setting';
import {Message,MessageService} from 'primeng/api';

/**
 * 發送通知 Service <br/>
 *
 * @author Winnie
 * @date 2022/05/03
 */

@Injectable({
  providedIn: 'root'
})
export class NotificationsService  extends MessageService {
  // msg= new Subject<Message[]>();
  // msg: import("rxjs").Observable<Message | Message[]>;
  msg : Message[] = [];
  msg_subject$ = new Subject<Message[]>();

  constructor(public messageService: MessageService) { 
    super();
  }
  // success(content: string) {
  //   this.messages$.next([{ severity: 'success', summary: content, detail: '' }]);
  // }
  // error(content: string) {
  //   this.messages$.next([{ severity: 'error', summary: content, detail: '' }]);
  // }
  // info(content: string) {
  //   this.messages$.next([{ severity: 'info', summary: content, detail: '' }]);
  // }
  // warn(content: string) {
  //   this.messages$.next([{ severity: 'warn', summary: content, detail: '' }]);
  // }

  success(msg){
    this.showMsg('success',msg);
  }
  error(msg){
    this.showMsg('error',msg);
  }
  info(msg){
    this.showMsg('info',msg);
  }
  warn(msg){
    this.showMsg('warn',msg);
  }


  private showMsg(msg_type,msg) {
    // this.messageService.add({severity:msg_type, summary:msg});
    
    this.msg = [{severity:msg_type, summary:msg}];
    this.msg_subject$.next(this.msg);
    setTimeout(() => {
      // console.log("len: ", this.msg_subject$.observers)    
      // console.log("len: ", this.msg_subject$.observers.length)    
      // if (this.msg_subject$.observers.length == 1)
      // {  
      this.msg = []
      this.msg_subject$.next(this.msg);
      // }
    }, 2000);
    console.log("showMsg end");  
  }

  // private showMsg2(){
  //   this.add({severity:'success', summary:'Service Message 2222'});
  //   console.log("this.messageObserver: ", this.messageObserver);
  //   this.msg_subject$.next([{severity:'info', summary:'Info Message', detail:'PrimeNG rocks'}]);
  //   // setTimeout(() => {
  //   //     this.clearViaService();
  //   // }, 2000);
  //   console.log("12313123");
  // }

  showViaService() {
    console.log("notification show via");
    this.messageService.add({severity:'success', summary:'Service Message 2222'});
  }

  clearViaService() {
    this.messageService.clear();
  }
}