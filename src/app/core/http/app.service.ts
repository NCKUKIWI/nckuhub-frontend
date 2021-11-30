import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { defer, Observable } from 'rxjs';
import { AppSettings } from './app.setting';
import { AppRequestContext, NckuhubResponse } from '../models/http-vo-model';
import { finalize, map } from 'rxjs/operators';
import { LoadingService } from './loading.service';

/**
 * 應用程式共用服務 <br/>
 */
@Injectable({
    providedIn: 'root',
})
export class AppService {
    constructor(private http: HttpClient, private loadingService: LoadingService) {}

    /**
     * 以HTTP POST方式傳送訊息
     * @param context
     * @return n/a
     */
    post(context: AppRequestContext): Observable<NckuhubResponse> {
        // setting httpOptions for POST
        const httpOptions = this.setHttpOptions(context.param);
        return this.sendRequest(context, this.http.post(AppSettings.API_ENDPOINT + context.url, context.body ?? {}, httpOptions));
    }

    /**
     * 以HTTP GET 方式傳送訊息
     * @param context
     */
    get(context: AppRequestContext): Observable<NckuhubResponse> {
        // setting httpOptions for GET
        const httpOptions = this.setHttpOptions(context.param);
        return this.sendRequest(context, this.http.get(AppSettings.API_ENDPOINT + context.url, httpOptions));
    }

    /**
     * 以HTTP PUT 方式傳送訊息
     * @param context
     */
    put(context: AppRequestContext): Observable<NckuhubResponse> {
        // setting httpOptions for PUT
        const httpOptions = this.setHttpOptions(context.param);
        return this.sendRequest(context, this.http.put(AppSettings.API_ENDPOINT + context.url, context.body ?? {}, httpOptions));
    }

    /**
     * 以HTTP DELETE 方式傳送訊息
     * @param context
     */
    delete(context: AppRequestContext): Observable<NckuhubResponse> {
        // setting httpOptions for DELETE
        const httpOptions = this.setHttpOptions(context.param);
        return this.sendRequest(context, this.http.delete(AppSettings.API_ENDPOINT + context.url, httpOptions));
    }

    private sendRequest(context: AppRequestContext, method: Observable<ArrayBuffer>): Observable<NckuhubResponse> {
        return defer(() => {
            return method.pipe(
                // 設定幾秒鐘timeout
                // timeout(AppSettings.APP_TIME_OUT),
                map(this.dataMapping),
                finalize(() => {
                    this.loadingService.hide();
                })
            );
        });
    }

    /**
     * mapping data from backend
     * TODO: 要把後端跟前端資料型態統一
     * @param res
     */
    private dataMapping = (res: any): NckuhubResponse => {
        const newRes = new NckuhubResponse();
        newRes.model = res;
        return newRes;
    }

    /**
     * 設定 http options
     * @param params
     * @returns
     */
    private setHttpOptions(params: HttpParams): any {
        return {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
            params,
            withCredentials: true,
        };
    }

    // TODO: defer 原因
}
