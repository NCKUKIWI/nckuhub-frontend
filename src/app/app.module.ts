import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CourseRoutingModule } from './pages/course/course-routing.module';
import { SharedModule } from './shared/share.module';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HelperComponent } from './pages/course/components/helper/helper.component';

@NgModule({
    declarations: [AppComponent, HelperComponent],
    imports: [
        BrowserModule.withServerTransition({ appId: 'serverApp' }),
        SharedModule,
        AppRoutingModule, // router
        CourseRoutingModule,
        HttpClientModule,
        BrowserAnimationsModule,
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
