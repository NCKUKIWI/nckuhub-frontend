import { NgModule } from '@angular/core';
import { NextLinePipe } from './next-line.pipe';
import { SearchFilterPipe } from './search-filter.pipe';
// for shared pipe module to sharedModule

@NgModule({
    declarations: [NextLinePipe, SearchFilterPipe],
    exports: [NextLinePipe,SearchFilterPipe],
})
export class PipeModule {}
