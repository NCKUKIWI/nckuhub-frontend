import { Injectable } from "@angular/core";

/**
 * loading 動畫 service <br/>
 * 
 * @author Nick Liao
 * @date 2021/09/20
 */
@Injectable({
    providedIn: 'root'
})
export class LoadingService{
   
    /** 動畫是否顯示 */
    isShow: boolean = false;

    show(){
        if(!this.isShow){
            this.isShow = true;
            // TODO
        }
    }

    hide(){
        if(this.isShow){
            // TODO
        }
        this.isShow = false;
    }
}