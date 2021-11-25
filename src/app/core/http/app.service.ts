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
        return defer(() => {
            if (context.autoLoading) {
                this.loadingService.show();
            }
            // setting httpOptions
            const httpOptions = this.setHttpOptions(context.param);

            // post
            return this.http.post<NckuhubResponse>(AppSettings.API_ENDPOINT + context.url, context.body ?? {}, httpOptions).pipe(
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
     * 以HTTP GET方式傳送訊息
     * @param context
     */
    get(context: AppRequestContext): Observable<NckuhubResponse> {
        return defer(() => {
            // setting httpOptions
            const httpOptions = this.setHttpOptions(context.param);

            return this.http.get<NckuhubResponse>(AppSettings.API_ENDPOINT + context.url, httpOptions).pipe(
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
    };

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
