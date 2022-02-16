import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavigationEnd, Event, NavigationError, Router } from '@angular/router';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { WriteCommentComponent } from '../write-comment/write-comment.component';

@Component({
    selector: 'app-button',
    templateUrl: './button.component.html',
    styleUrls: ['./button.component.scss'],
})
export class ButtonComponent implements OnInit, OnDestroy {
    constructor(private dialogService: DialogService, private router: Router) {}

    // DynamicDialog的參數
    ref: DynamicDialogRef;
    // 判斷在courseSearch或是timeTable
    isInTimeTable: boolean = false;
    // 判斷是否正在編輯課表
    isEditTable: boolean = false;

    ngOnInit(): void {
        this.checkRouter(this.router.url);
        this.subscribeRouter();
    }

    /**
     * 判斷在courseSearch或是timeTable
     */
    private checkRouter(url: string): void {
        if (url === '/course/timetable') {
            this.isInTimeTable = true;
        } else {
            this.isInTimeTable = false;
        }
    }

    /**
     * 監督router是否有變化
     */
    private subscribeRouter(): void {
        this.router.events.subscribe((event: Event) => {
            if (event instanceof NavigationEnd) {
                this.checkRouter(event.url);
            }
            if (event instanceof NavigationError) {
                console.log(event.error);
            }
        });
    }

    /**
     * 打開課程心得留言
     */
    private addCourseComment(): void {
        this.ref = this.dialogService.open(WriteCommentComponent, {
            width: '100vw',
            height: '100vh',
            baseZIndex: 10000,
            transitionOptions: null,
            style: { marginTop: '-10vh' },
        });
    }

    ngOnDestroy(): void {
        if (this.ref) {
            this.ref.close();
        }
    }

    /**
     * 編輯課表
     */
    private editTimeTable(): void {
        this.isEditTable = true;
    }

    /**
     * 儲存正在編輯的課表
     */
    private saveTimeTable(): void {
        this.isEditTable = false;
    }

    /**
     * 取消正在編輯的課表
     */
    private cancelTimeTable(): void {
        this.isEditTable = false;
    }
}
