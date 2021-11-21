import { NgModule } from '@angular/core';
import { EnglishNumberDirective } from './input-english-number.directive';

// for shared directive module to sharedModule

@NgModule({
    declarations: [EnglishNumberDirective],
    exports: [EnglishNumberDirective],
})
export class DirectiveModule {}
