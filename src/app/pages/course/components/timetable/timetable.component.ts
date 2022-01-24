import { Component, OnInit } from '@angular/core';
import { TimetableService,TableCellData } from '../../services/timetable.service';
import { CourseModel } from '../../models/Course.model';

@Component({
    selector: 'app-timetable',
    templateUrl: './timetable.component.html',
    styleUrls: ['./timetable.component.scss'],
})
export class TimetableComponent implements OnInit {

    // 當前課表 是否 鎖定
    isLocked=false;

    // 暫時的使用者課表
    tempTable:number[];
    
    // 平日時段的 展示版課表
    coursesOnWorkdays: TableCellData[][];
    // 非平日時段的 展示版課表
    coursesOnOtherDays: CourseModel[];

    constructor(private timetableService: TimetableService) { }

    ngOnInit(): void {
        // TODO: ecfack 從timetableServicec 獲取 展示版課表 和使用者課表
        this.tempTable=this.timetableService.tempTable;
        this.coursesOnWorkdays=this.timetableService.coursesOnWorkdays;
        this.coursesOnOtherDays=this.timetableService.coursesOnOtherDays;
    }

    /**
     * TODO: ecfack 切換 課表的鎖定狀態
     */
    switchToEdit():void {
        this.isLocked=!this.isLocked;
        // vue_fixed_button.switchLockStatus();
    }

    /**
     * TODO: ecfack 從課表 移除 特定課程
     * @param courseId 特定課程的Id
     */
    deleteItem(courseId: number):void {
        this.timetableService.deleteItem(courseId);
    }
}