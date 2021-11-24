import { Component, OnInit } from '@angular/core';
import {CourseService} from '../../services/course.service';
import {AppUrl} from '../../../../core/http/app.setting';
import {tap} from 'rxjs/operators';
import {Course} from '../../models/course.model';
import {AppService} from '../../../../core/http/app.service';

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
