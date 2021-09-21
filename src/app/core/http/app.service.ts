import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { defer, Observable } from "rxjs";
import { AppSettings } from "./app.setting";
import { AppRequestContext, NckuhubResponse } from "./http-vo-model";
import { finalize, tap, timeout } from 'rxjs/operators';
import { LoadingService } from './loading.service';



/**
 * 應用程式共用服務 <br/>
 */
@Injectable({
    providedIn: "root",
})
export class AppService {

    constructor(
        private http: HttpClient,
        private loadingService: LoadingService
    ){}

    /**
     * 以HTTP POST方式傳送訊息
     * @param context 
     * @return n/a
     */
    post(context: AppRequestContext): Observable<NckuhubResponse> {
        return defer(() => {
            if(context.autoLoading){
                this.loadingService.show();
            }
            // setting httpOptions
            const httpOptions = this.setHttpOptions(context.param);

            // post
            return this.http.post<NckuhubResponse>(AppSettings.API_ENDPOINT + context.url, context.body ?? {}, httpOptions)
            .pipe(
                // 設定幾秒鐘timeout
                // timeout(AppSettings.APP_TIME_OUT),
                finalize(() => {
                    this.loadingService.hide();
                })
            )
        });
    }

    /**
     * 設定 http options
     * @param params 
     * @returns 
     */
    private setHttpOptions(params: HttpParams): Object{
        return  { 
            headers: new HttpHeaders({ 'Content-Type': 'application/json'}),
            params: params
        };
    }
    
    // TODO: defer 原因
}
