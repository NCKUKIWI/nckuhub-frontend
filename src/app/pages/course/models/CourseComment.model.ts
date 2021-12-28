import { CourseModel, CourseRawModel } from './Course.model';
import { CourseRateModel } from './CourseRate.model';

export class CourseWithCommentModel {
    cold: string;
    comment: CourseComment[];
    courseInfo: CourseRawModel;
    courserate_id: number;
    got: string;
    rate_count: number;
    rates: CourseRateModel[];
    sweet: string;
}

export class CourseComment {
    comment: string;
    id: number;
    semester: string;
}
