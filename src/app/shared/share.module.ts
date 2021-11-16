import {NgModule} from '@angular/core';
import {DirectiveModule} from './directives/directive.module';
import {PipeModule} from './pipes/pipe.module';
import {ComponentModule} from './components/component.module';


/**
 * Shared Module
 */
@NgModule({
    declarations: [
    ],
    imports: [
        ComponentModule,
        DirectiveModule,
        PipeModule
    ],
    exports: [
        ComponentModule,
        DirectiveModule,
        PipeModule
    ]
})
export class SharedModule {}
