import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CourseService } from '../../services/course.service';
import { CourseWithCommentModel } from '../../models/CourseComment.model';
import { CourseComment } from '../../models/CourseComment.model';
import { CourseModel } from '../../models/Course.model';

@Component({
    selector: 'app-course-content',
    templateUrl: './course-content.component.html',
    styleUrls: ['./course-content.component.scss'],
})
export class CourseContentComponent implements OnInit {
    // 紀錄該課程的留言資料
    private score_data: CourseWithCommentModel;
    // 用於score_data中的courseInfo
    private course_data: CourseModel;
    // 用於score_data中的comment
    private comment_data: CourseComment[];

    constructor(private router: ActivatedRoute, private courseService: CourseService) {
        // 抓取該課程的資料
        this.router.params.subscribe((param) => {
            const courseId: number = param.course_id;

            this.courseService.fetchCourseWithComments(courseId).subscribe((commentData) => {
                this.score_data = commentData;
                this.course_data = commentData.courseInfo;
                this.comment_data = commentData.comment;
                console.log(this.score_data, this.course_data);
            });
        });
    }

    ngOnInit(): void {}
}
