
import { NgModule } from '@angular/core';
import { DelayDirective, TitleDirective, EditorDirective, ChartDirective } from '@core/directive';
import { DataService } from '@core/service';

@NgModule({
    declarations: [
        DelayDirective,
        EditorDirective,
        ChartDirective,
        TitleDirective,
    ],
    exports: [
        DelayDirective,
        EditorDirective,
        ChartDirective,
        TitleDirective,
    ],
    providers: [
        DataService,
    ]
})
export class CoreModule {}