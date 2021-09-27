import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { UserService } from './core/service/user.service';
import { MessageService } from './core/service/message.service';
import { DialogService } from './core/service/dialog.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,     // router
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
