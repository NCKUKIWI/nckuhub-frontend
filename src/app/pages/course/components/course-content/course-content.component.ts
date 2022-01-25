import {Component, OnInit, Optional} from '@angular/core';
import {Location} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {CourseService} from '../../services/course.service';
import {WishListService} from '../../services/wish-list.service';
import {CourseComment, CourseWithCommentModel} from '../../models/CourseComment.model';
import {CourseModel} from '../../models/Course.model';
import {AppUrl} from '../../../../core/http/app.setting';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {Observable, of} from 'rxjs';
import {map, take} from 'rxjs/operators';

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

    constructor(
      private route: ActivatedRoute,
      private router: Router,
      private courseService: CourseService,
      private wishListService: WishListService,
      @Optional()
      public ref: DynamicDialogRef,
      @Optional()
      public config: DynamicDialogConfig,
      private location: Location
    ) {
    }

    ngOnInit(): void {
        // 取得 courseId
        this.getCourseIdByDiffSource().pipe(take(1)).subscribe(courseId => {
            // 取得課程內容
            this.fetchCourseByCourseId(courseId);
            // 是否 在願望清單
            this.inWishList = this.wishListService.isInWishList(courseId);
        });
    }

    /**
     * 取得 courseId by 不同來源
     * 來源ㄧ: 使用 DialogService 傳入 config
     * 來源二: 使用 url 找param 的courseId
     */
    getCourseIdByDiffSource(): Observable<number> {
        // 抓取該課程的資料(For dialog)
        if (this.config !== null) {
            return of(this.config.data.courseId);
        }
        // 抓取該課程的資料(For website url)
        return this.route.params.pipe(map(param => param.courseId));
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
            this.location.replaceState('/course/' + this.config.data.courseId);
        });
    }

    /**
     * 關閉課程Dialog
     */
    closeCourseDialog(): void {
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
        this.inWishList = !this.inWishList;
    }
}
