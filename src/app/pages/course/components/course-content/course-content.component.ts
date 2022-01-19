import {Component, OnInit, Optional} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {CourseService} from '../../services/course.service';
import {CourseComment, CourseWithCommentModel} from '../../models/CourseComment.model';
import {CourseModel} from '../../models/Course.model';
import {AppUrl} from '../../../../core/http/app.setting';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';

/**
 * 課程內頁
 * @author Yu_Tai
 * @date 2021/12/28
 */
@Component({
    selector: 'app-course-content',
    templateUrl: './course-content.component.html',
    styleUrls: ['./course-content.component.scss'],
})
export class CourseContentComponent implements OnInit {
    // 該課程的留言資料(包含評分、課程資料、留言)
    scoreData: CourseWithCommentModel;
    // score_data中的courseInfo(課程資料)
    courseData: CourseModel;
    // score_data中的comment(留言)
    commentData: CourseComment[];
    // 使用者的wishlist
    wishList: number[] = [];
    // // 課程內頁是否展示
    // display: boolean = true;

    constructor(
        private route: ActivatedRoute,
        private courseService: CourseService,
        @Optional()
        public ref: DynamicDialogRef,
        @Optional()
        public config: DynamicDialogConfig
    ) {
        // 抓取該課程的資料
        this.route.params.subscribe((param) => {
            if (param.courseId) {
                this.fetchCourseByCourseId(param.courseId);
            }
        });
    }

    ngOnInit(): void {
        // 抓取該課程的資料
        if (this.config !== null) {
            this.fetchCourseByCourseId(this.config.data.courseId);
        }
        // 取得 願望清單
        this.getUserWishList();
    }

    /**
     * 抓取課程資料
     * @param courseId
     */
    fetchCourseByCourseId(courseId: number): void {
        this.courseService.fetchCourseWithComments(courseId).subscribe((courseCommentData) => {
            this.scoreData = courseCommentData;
            this.courseData = courseCommentData.courseInfo;
            this.commentData = courseCommentData.comment;

            // 課程評分四捨五入到整數
            this.scoreData.got = Math.round(parseFloat(this.scoreData.got)).toString();
            this.scoreData.sweet = Math.round(parseFloat(this.scoreData.sweet)).toString();
            this.scoreData.cold = Math.round(parseFloat(this.scoreData.cold)).toString();
        });
    }

    /**
     * 關閉課程內頁
     */
    closeCourseContent(): void {
        if (this.ref) {
            this.ref.close();
        }
    }

    /**
     * 開啟 該課程的大綱
     * @param deptId
     * @param courseId
     * @private
     */
    openOutline(deptId, courseId): void {
        window.open(AppUrl.GET_COURSE_OUTLINE(deptId, courseId), '_blank');
    }

    /**
     * 取得 願望清單
     */
    getUserWishList(): void {
        this.wishList = JSON.parse(localStorage.getItem('wishList'));
        if (this.wishList === null) {
            this.wishList = [];
        }
    }

    /**
     * 新增&刪除 願望清單
     * @param id
     */
    setWishlist(id: number): void {
        if (this.wishList.includes(id)) {
            // 刪除 該課程
            const index = this.wishList.findIndex((x) => x === id);
            this.wishList.splice(index, 1);
            localStorage.setItem('wishList', JSON.stringify(this.wishList));
        } else {
            // 新增 該課程
            this.wishList.push(id);
            localStorage.setItem('wishList', JSON.stringify(this.wishList));
        }
    }
}
