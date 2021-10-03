import { NgModule } from '@angular/core';
import { DirectiveModule } from './directives/directive.module';
import { PipeModule } from './pipes/pipe.module';


/**
 * Shared Module
 */
@NgModule({
    declarations:[
    ],
    imports: [
        DirectiveModule,
        PipeModule
    ],
    exports:[
        DirectiveModule,
        PipeModule
    ]
})
export class SharedModule {}
