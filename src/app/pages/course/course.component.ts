import { Component, OnInit } from '@angular/core'
import {CourseService} from './course.service';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css'],
})
export class CourseComponent implements OnInit {
  constructor(
    private course: CourseService
  ) {}

  ngOnInit(): void {
    // TODO: get parameter about course_Id
  }
}
