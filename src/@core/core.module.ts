
import { NgModule } from '@angular/core';
import { DelayDirective, TitleDirective, EditorDirective, ChartDirective, TooltipDirective } from '@core/directive';
import { DataService } from '@core/service';

@NgModule({
    declarations: [
        DelayDirective,
        EditorDirective,
        ChartDirective,
        TitleDirective,
        TooltipDirective
    ],
    exports: [
        DelayDirective,
        EditorDirective,
        ChartDirective,
        TitleDirective,
        TooltipDirective
    ],
    providers: [
        DataService
    ]
})
export class CoreModule {}
