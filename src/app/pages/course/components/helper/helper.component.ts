import { Component, OnInit, Optional } from '@angular/core';
import { UserService } from '../../../../core/service/user.service'
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

/**
 * 小幫手內頁
 * @author Winnie
 * @date 2022/04/03
 */
@Component({
  selector: 'app-helper',
  templateUrl: './helper.component.html',
  styleUrls: ['./helper.component.scss']
})
export class HelperComponent implements OnInit {
  points: number = 0;
  threshold_points: number = 5; 
  need_points = this.threshold_points - this.points
  ensure_page_opened: boolean = false;
  success_page_opened: boolean = false;
  messenger_code: string = "";
  is_used: boolean = false; // TBD
  this_semester = "109-2"; // TBD


  constructor(
    private userService: UserService,
    @Optional()
    public ref: DynamicDialogRef,
    @Optional()
    public config: DynamicDialogConfig,
  ) { }

  ngOnInit(): void {
    this.getUserHelperPoints()
  }
  Update_needPoint()
  {
    this.need_points = this.threshold_points - this.points
  }

  getUserHelperPoints():void{
    this.userService.getUserHelperInfo().subscribe(
        (userData) => {
            console.log("userData : ",userData);
            console.log("userData point : ",userData.model.point);
              
            if (userData.model.point)
            // {
                // const fb_id = userData.model.user.fb_id;
                this.messenger_code = userData.model.messenger_code
                this.points = userData.model.point;
                this.points = 5
                this.Update_needPoint()
            //     this.user_sign_in = true;
                
            // }
        },
        (err: any) => {
            if (err) {
                console.error(err);
            }
        }
    );
  }
    /**
     * 關閉課程內頁
     */
     closeHelperContent(): void {
      if (this.ref) {
          this.ref.close();
      }
  }
  OpenEnsurePage(){
    this.ensure_page_opened = true;
  }

  StartHelper(){
    this.success_page_opened = true;
  }

  // CloseEnsurePage(){
  //   this.ensure_page_opened = false;
  // }

  // CloseSuccessPage(){
  //   this.success_page_opened = false;
  // }

  ClosePage(event){
    // var target = event.srcElement.parentElement.parentElement.parentElement.id
    var target = event.currentTarget.parentElement.parentElement.parentElement.parentElement

    if (target.id == "helperSuccess")
      this.success_page_opened = false;
    if (target.id == "helperEnsure")
      this.ensure_page_opened = false;
      
    console.log("target: ", target);
  }

  copyMessengerCode() {
    document.addEventListener('copy', (e: ClipboardEvent) => {
      e.clipboardData.setData('text/plain', (this.messenger_code));
      e.preventDefault();
      document.removeEventListener('copy', null);
    });
    document.execCommand('copy');
  }
}
