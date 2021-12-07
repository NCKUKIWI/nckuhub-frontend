import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CourseService } from '../../services/course.service';
import { CourseModel } from '../../models/Course.model';

@Component({
    selector: 'app-course-search',
    templateUrl: './course-search.component.html',
    styleUrls: ['./course-search.component.scss'],
})
export class CourseSearchComponent implements OnInit, AfterViewInit {
    //完整的本學期課程
    course_data: CourseModel[] = [];
    //部分的本學期課程，用於展示在課程列表
    displayed_course_data: CourseModel[] = [];

    constructor(private courseService: CourseService) { }

    //Implement infinite scroll with intersection observer API 
    //紀錄目前已載入(batch_index-1)批的課程
    private batch_index = 2;
    //callback用來從course_data載入課程到displayed_course_data
    private observer = new IntersectionObserver((entries, observer) => {
        if (this.displayed_course_data.length < this.course_data.length) {
            //每次載入的批量
            const batch_size = 10;

            this.displayed_course_data = this.displayed_course_data.concat(
                this.course_data.slice(this.displayed_course_data.length,this.batch_index * batch_size));
            ++this.batch_index;
            console.log(`displayed_course_data.length：${this.displayed_course_data.length}`);
        }
    }, { threshold:0 });
    //放置於課程列表的DOM元素
    private course_data_end: Element | null = null;

    ngOnInit(): void {
        this.getCourseData();
    }

    ngAfterViewInit(): void {
        //intersection observer開始觀察
        this.course_data_end = document.querySelector('.course_data_end');
        if (this.course_data_end)
            this.observer.observe(this.course_data_end);
        else
            console.log("infinite scroll fail!!\n");
    }

    //打API拿course_data
    getCourseData() {
        this.courseService.getCourseData().subscribe((courseData) => {
            this.course_data = courseData;
            this.displayed_course_data = this.course_data.slice(0, 10);
            console.log("get course data", courseData.length);
        });
    }

    deptTransCat(deptID: string, deptName: string) {
        let category: string;
        switch (deptID) {
            case "A9":
                category = '通';
                break;
            case "A6":
                category = '服';
                break;
            case "A7":
                category = '國';
                break;
            case "A1":
                category = '外';
                break;
            case "A2":
                category = '體';
                break;
            default:
                category = deptName.substring(0, 1);
        }
        return category;
    }
}
