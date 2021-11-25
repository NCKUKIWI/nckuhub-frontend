import {Component, OnInit} from '@angular/core';
import {CourseService} from '../../services/course.service';

@Component({
    selector: 'app-course-search',
    templateUrl: './course-search.component.html',
    styleUrls: ['./course-search.component.scss'],
})
export class CourseSearchComponent implements OnInit {
    constructor(private courseService: CourseService) {}

    ngOnInit(): void {

    }
}
