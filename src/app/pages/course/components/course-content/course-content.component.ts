import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CourseService } from '../../services/course.service';
import { CourseWithCommentModel } from '../../models/CourseComment.model';
import { CourseComment } from '../../models/CourseComment.model';
import { CourseModel } from '../../models/Course.model';
import { AppUrl } from '../../../../core/http/app.setting';

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
    private scoreData: CourseWithCommentModel;
    // score_data中的courseInfo(課程資料)
    private courseData: CourseModel;
    // score_data中的comment(留言)
    private commentData: CourseComment[];
    // 使用者的wishlist
    private wishList: number[] = [];

    constructor(private router: ActivatedRoute, private courseService: CourseService) {
        // 抓取該課程的資料
        this.router.params.subscribe((param) => {
            const courseId: number = param.course_id;

            // 將抓到資料分成scoreData, courseData, commentData
            this.courseService.fetchCourseWithComments(courseId).subscribe((courseCommentData) => {
                this.scoreData = courseCommentData;
                this.courseData = courseCommentData.courseInfo;
                this.commentData = courseCommentData.comment;

                // 課程評分四捨五入到整數
                this.scoreData.got = Math.round(parseFloat(this.scoreData.got)).toString();
                this.scoreData.sweet = Math.round(parseFloat(this.scoreData.sweet)).toString();
                this.scoreData.cold = Math.round(parseFloat(this.scoreData.cold)).toString();
            });
        });
    }

    ngOnInit(): void {
        // 取得 願望清單
        this.getUserWishList();
    }

    /**
     * 取得 願望清單
     */
    getUserWishList(): void {
        this.wishList = JSON.parse(localStorage.getItem('wishList'));
        if (this.wishList == null) {
            this.wishList = [];
        }
    }

    /**
     * 開啟 該課程的大綱
     * @param deptId
     * @param courseId
     * @private
     */
    private openOutline(deptId, courseId): void {
        window.open(AppUrl.GET_COURSE_OUTLINE(deptId, courseId), '_blank');
    }

    /**
     * 新增&刪除 願望清單
     * @param id
     */
    setWishlist(id: number): void {
        if (this.wishList.includes(id)) {
            // 刪除 該課程
            const index = this.wishList.findIndex((x) => x == id);
            this.wishList.splice(index, 1);
            localStorage.setItem('wishList', JSON.stringify(this.wishList));
        } else {
            //新增 該課程
            this.wishList.push(id);
            localStorage.setItem('wishList', JSON.stringify(this.wishList));
        }

        // if (userData.now_wishlist.includes(id)){
        //   wishlistRemove(id);
        // }
        // else{
        //   wishlistAdd(id);
        // }
    }
}
