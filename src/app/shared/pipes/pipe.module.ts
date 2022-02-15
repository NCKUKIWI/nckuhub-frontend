import { NgModule } from '@angular/core';
import { NextLinePipe } from './next-line.pipe';

// for shared pipe module to sharedModule

@NgModule({
    declarations: [NextLinePipe],
    exports: [NextLinePipe],
})
export class PipeModule {}
