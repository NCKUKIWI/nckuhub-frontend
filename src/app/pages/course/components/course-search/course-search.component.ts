import { Component, OnInit, AfterViewInit, HostListener } from '@angular/core';
import { CourseService } from '../../services/course.service';
import { CourseModel } from '../../models/Course.model';

@Component({
    selector: 'app-course-search',
    templateUrl: './course-search.component.html',
    styleUrls: ['./course-search.component.scss'],
})
export class CourseSearchComponent implements OnInit{
    //完整的本學期課程
    course_data_db: CourseModel[] = [];
    //部分的本學期課程，用於展示在課程列表
    course_data: CourseModel[] = [];

    course_with_comment:CourseModel[]=[];

    comment_only=false;
    filter_with_dpmt=false;
    count_height=1;
    count_index=0;

    keyword= '';
    dept= [];
    dept_dropdown: [];
    filter_by_dpmt: [];
    keyPrefix: '';

    mobile_status: 'default';

    constructor(private courseService: CourseService) { }

    //listen scroll event
    @HostListener('scroll',['$event.target'])
    handleScroll(list: HTMLElement): void {
        let list_height = list.offsetHeight;    //Need to use jquery
        let scroll_height = list.scrollTop;
        if(this.comment_only==false && this.filter_with_dpmt==false) {
          if(scroll_height >= list_height * this.count_height){
            for(var i = 200 + this.count_index*20; i< 200 + (this.count_index+1)*20;++i){
              this.course_data.push(this.course_data_db[i]);
            }
            this.count_index++;
            this.count_height++;
          }
        }
    }

    ngOnInit(): void {
        this.getCourseData();
    }

    //打API拿course_data
    getCourseData() {
        this.courseService.getCourseData().subscribe((courseData) => {
            this.course_data_db = courseData;
            this.course_data = this.course_data_db.slice(0, 200);
            this.course_with_comment = this.course_data_db.filter(course => course.comment_num > 0)
            console.log("get course data", courseData.length);
        },
        (err:any)=>{
            if(err) console.error(err);
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

    openCoursePage(courseId: string) {

    }

    setCourse(courseId: string) {

    }

    deleteSearch() {
        this.keyword="";
    }

    comment_filter() {  //angular material
        let cCheck = <HTMLInputElement>document.getElementById("commentCheck");
        if (cCheck.checked == true) {
            this.comment_only = true;

            // if (this.filter_with_dpmt == true) {
            //     this.course_data = [];
            //     for (let i in this.filter_by_dpmt) {
            //         if (this.filter_by_dpmt[i].comment_num > 0) {
            //             vue_course_item.course_data.push(this.filter_by_dpmt[i]);
            //         }
            //     }
            // } else {
            //     vue_course_item.course_data = [];
            //     vue_course_item.course_data = vue_course_item.course_with_comment;
            // }
            this.course_data = [];
            this.course_data = this.course_with_comment;
        } else {
            this.course_data = [];
            this.comment_only = false;
            for (var i = 0; i < 100; ++i) {
                this.course_data.push(this.course_data_db[i]);
            }
            // console.log(this.course_data.length);
        }
    }
}
