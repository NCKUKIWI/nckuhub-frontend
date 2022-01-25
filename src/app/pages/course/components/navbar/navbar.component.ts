import { Component, OnChanges, OnInit, DoCheck } from '@angular/core';
import { Router } from '@angular/router';
import { CourseModel } from '../../models/Course.model';
import { CourseService } from '../../services/course.service';
import { take, filter } from 'rxjs/operators';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss', '../../course.component.css'],
})

export class NavbarComponent implements OnInit, OnChanges, DoCheck {
    public href: string = "";
    private windowTab: String = "";
    private isDropdownOpen: Boolean=false;
    private allCourseInNewSemester: CourseModel[] = [];


    constructor(
        private router: Router,
        private courseService: CourseService
    ) {}

    ngOnInit(): void {
        this.href = this.router.url;
        this.updateWindowTab();   
        this.getCourseData();
    }
    private getCourseData(): void {
        console.log("123");
        // 加filter是因為可能會收到空陣列
        this.courseService.getCourseData().pipe(filter(data => data.length != 0), take(1)).subscribe(
            (courseData) => {
                this.allCourseInNewSemester = courseData;
                console.log("願望清單獲取總課程成功", this.allCourseInNewSemester.length);
            },
            (err: any) => {
                if (err) {
                    console.error(err);
                }
            }
        );
    }
    ngOnChanges():void{

    }

    ngDoCheck(): void {
        this.href = this.router.url;
        if (this.windowTab != this.href.split('/')[2])
            this.updateWindowTab();
    }

    updateWindowTab(){
        this.windowTab = this.href.split('/')[2];
    }
    


}
