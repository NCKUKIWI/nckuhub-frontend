import { Component, OnInit, Optional } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../../services/course.service';
import { WishListService } from '../../services/wish-list.service';
import { CourseComment, CourseWithCommentModel } from '../../models/CourseComment.model';
import { CourseModel } from '../../models/Course.model';
import { AppUrl } from '../../../../core/http/app.setting';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';

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
    // 該課程是否已在wishList
    inWishList: boolean;
    // 課程內頁是否已經顯示
    display: boolean = false;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private courseService: CourseService,
        private wishListService: WishListService,
        @Optional()
        public ref: DynamicDialogRef,
        @Optional()
        public config: DynamicDialogConfig
    ) {}

    ngOnInit(): void {
        // 抓取該課程的資料(For dialog)
        if (this.config !== null) {
            const courseId = this.config.data.courseId;
            this.display = true;
            this.fetchCourseByCourseId(courseId);
            this.wishListCheck(courseId);
        }

        // 抓取該課程的資料(For website url)
        if (!this.display) {
            this.route.params.subscribe((param) => {
                this.fetchCourseByCourseId(param.courseId);
                this.wishListCheck(param.courseId);
            });
        }
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

            // route是否為該課程的網址
            if (this.display === true) {
                this.router.navigateByUrl('/course/' + this.config.data.courseId);
            }
        });
    }

    /**
     * 關閉課程Dialog
     */
    closeCourseDialog(): void {
        if (this.ref) {
            this.display = false;
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
     * 該課程是否已存在願望清單
     * @param courseId
     */
    wishListCheck(courseId: number): boolean {
        return this.wishListService.isInWishList(courseId);
    }

    /**
     * 新增&刪除 願望清單
     * @param courseId
     */
    setWishlist(courseId: number): void {
        if (this.inWishList) {
            // 刪除 該課程
            this.wishListService.removeWish(courseId);
        } else {
            // 新增 該課程
            this.wishListService.addWish(courseId);
        }
    }
}
