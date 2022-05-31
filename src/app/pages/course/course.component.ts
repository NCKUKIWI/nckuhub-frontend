import { Component, OnInit } from '@angular/core';
import { CourseService } from './services/course.service';
import {Message,MessageService} from 'primeng/api';
import { NotificationsService } from '../../core/service/notifications.service'
import {Observable,Subject, Subscription} from 'rxjs';

@Component({
    selector: 'app-course',
    templateUrl: './course.component.html',
    styleUrls: ['./course.component.css'],
    providers:[MessageService]
})
// '../../../../node_modules/primeng/resources/primeng.min.css', '../../../../node_modules/primeicons/primeicons.css'
export class CourseComponent implements OnInit {
    constructor(private course: CourseService,public notificationsService: NotificationsService,public messageService: MessageService) {}
    // gfg: Message[];
    // msg = new Subject<Message[]>();
    //messageObserver: import("rxjs").Observable<Message | Message[]>;
    msg: Message[];


    ngOnInit(): void {

        // this.notificationsService.messageObserver.subscribe(msg => {
        //     console.log("messages111: ", msg);
        //     // this.msg.push(msg[0]);
        //     // console.log("this.msg: ",this.msg)
        // })


        // this.notificationsService.msg_subject$.subscribe(msg => {
        //     // if (msg)
        //         this.msg = msg;
        //     // else
        //     //     this.msg = [];
        //     console.log("notificationsService messages111: ", msg);
        //     // this.msg = msg;
        //     // console.log("this.msg: ",this.msg)
        // })
    }

    showMsg(){
        this.notificationsService.success("123");
        // this.messageService.add({severity:'success', summary:'Service Message 2222'});        
    }

    showErr(){
        this.notificationsService.error("123");
    }

    showViaService() {
        this.messageService.add({severity:'success', summary:'showViaService 2222'});
    }

    clearViaService() {
        this.messageService.clear();
    }    
    


}