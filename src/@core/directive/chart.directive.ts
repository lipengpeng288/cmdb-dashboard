import {
    Directive,
    ElementRef,
    EventEmitter,
    Input,
    OnInit,
    HostBinding,
    OnChanges,
    OnDestroy,
    Output
} from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import * as echarts from 'echarts';
import { ECharts, EChartsOption, EChartsTitleOption } from 'echarts';
import { ChartTheme } from './chart-theme';

@Directive({
    selector: 'chart, [chart]',
    exportAs: 'chart'
})
export class ChartDirective implements OnInit, OnChanges, OnDestroy {
    @HostBinding('style.width') _width: string;
    @Input() width: number|string; // The minimum width is 320px
    @HostBinding('style.height') _height: string;
    @Input() height: number|string; // The minimum height is 240px
    @Input() options: EChartsOption;
    @Input() lazyload: boolean = false; // This is for optimizing performance issue.
    @Input() lazyloadRender: boolean = false; // This is the switch which determines whether to render the chart in lazy render mode.
    @Input() title: string;
    @Input() subtitle: string;
    @Input() forceUpdate: boolean = false;
    @Input() autoRemediate: boolean = true;
    @Input() minSizeLimit: boolean = true;
    @Input() disableLog: boolean = false;

    @Output() readonly onClick = new EventEmitter();
    @Output() readonly onDoubleClick = new EventEmitter();
    @Output() readonly onMouseDown = new EventEmitter();
    @Output() readonly onMouseUp = new EventEmitter();
    @Output() readonly onMouseOver = new EventEmitter();
    @Output() readonly onMouseOut = new EventEmitter();
    @Output() readonly onGlobalOut = new EventEmitter();
    @Output() readonly onContextMenu = new EventEmitter();
    @Output() readonly onDataZoom = new EventEmitter();
    @Output() readonly onResize = new EventEmitter<ChartResizeEvent>();

    private sizeCheckInterval = null;
    private reSize$ = new Subject<string>();
    private _chart: ECharts;
    private _onResize: Subscription;
    private _initiated = false;
    private _prevOptions: EChartsOption;
    private _prevLazyloadRender: boolean;

    private _canonicalizeLog(named: any[], basic: any[]) {
        if ((!this.options) || this.disableLog) {
            return;
        }
        if (this.options.title && this.options.title.text) {
            const output: any[] = [];
            for (let i of named) {
                if (typeof i === 'string') {
                    output.push(i.replace('%title%', this.options.title.text));
                } else {
                    output.push(i);
                }
            }
            console.debug(...output);
        } else {
            console.debug(...basic);
        }
    }

    private _logEvent(type: string, e: any) {
        this._canonicalizeLog(
            [`CoreChart detected '${type}' event on '%title%' =>`, e],
            [`CoreChart detected '${type}' event =>`, e]
        );
    }

    private _autoRemediate() {
        if (this.minSizeLimit) {
            this._elem.nativeElement.firstChild.style.minHeight = '240px';
            this._elem.nativeElement.firstChild.style.minWidth = '320px';
        }
        if ((!this._height) || (this._height !== this.height)) {
            let height = '';
            if (this.height) {
                if (typeof this.height === 'number') {
                    if (this.height > 240) {
                        height = this.height.toString()+'px';
                    } else {
                        height = '240px';
                    }
                } else if (this.height === '*') {
                    height = '100%';
                } else {
                    height = this.height;
                }
            } else {
                height = '240px';
            }
            this._height = height;
        }
        if (!this._width || this._width !== this.width) {
            let width = '';
            if (this.width) {
                if (typeof this.width === 'number') {
                    if (this.width >= 320) {
                        width = this.width.toString()+'px';
                    } else {
                        width = '320px';
                    }
                } else if (this.width === '*') {
                    width = '100%';
                } else {
                    width = this.width;
                }
            } else {
                width = '320px';
            }
            this._width = width;
        }
        // Enforce to inherit size
        this._elem.nativeElement.firstChild.style.height = this._height = `${this._elem.nativeElement.offsetHeight}px`;
        this._elem.nativeElement.firstChild.style.width = this._width = `${this._elem.nativeElement.offsetWidth}px`;
    }

    private render() {
        this._autoRemediate();
        if (this.options) {
            if (this.title) {
                if (this.options.title) {
                    this.options.title.text = this.title;
                } else {
                    this.options.title = {text: this.title};
                }
            }
            if (this.subtitle) {
                if (this.options.title) {
                    this.options.title.subtext = this.subtitle;
                } else {
                    this.options.title = {subtext: this.subtitle};
                }
            }
            this._canonicalizeLog(
                [`CoreChart incoming options on '%title%' =>`, this.options],
                ['CoreChart incoming options =>', this.options]
            );
            // if (!this.chart) {
            //     this.chart = echarts.init(this._elem.nativeElement, ChartTheme.theme);
            // }
            this._chart.setOption(this.options, this.forceUpdate, false);
            this._canonicalizeLog(
                [`CoreChart chunk data on '%title%' =>`, this._chart.getOption()],
                ['CoreChart chunk data =>', this._chart.getOption()]
            );
        }
    }

    constructor(
        private _elem: ElementRef,
    ) {}

    ngOnInit() {
        if (!this._chart) {
            this._chart = echarts.init(this._elem.nativeElement, ChartTheme.theme);
        }
        this._canonicalizeLog(
            [`CoreChart layout on '%title%' => ${(this.width === '*')? 'auto': this.width}*${(this.height === '*')? 'auto': this.height}`],
            [`CoreChart layout => ${(this.width === '*')? 'auto': this.width}*${(this.height === '*')? 'auto': this.height}`]
        );
        this.sizeCheckInterval = setInterval(() => {
            this.reSize$.next(`${this._elem.nativeElement.offsetWidth} * ${this._elem.nativeElement.offsetHeight}`);
        }, 100);
        this._onResize = this.reSize$.pipe(distinctUntilChanged()).subscribe((s) => {
            this._autoRemediate();
            this._chart.resize();
            const size = {
                width: this._elem.nativeElement.offsetWidth,
                height: this._elem.nativeElement.offsetHeight
            };
            this.onResize.emit(size);
            this._canonicalizeLog(
                [`CoreChart was resized on '%title%' due to resolution change => ${size.width} * ${size.height}`],
                [`CoreChart was resized due to resolution change => ${size.width} * ${size.height}`]
            );
        });

        this._chart.on('click', e => {
            this._logEvent('click', e);
            this.onClick.emit(e);
        });
        this._chart.on('dblClick', e => {
            this._logEvent('dblClick', e);
            this.onDoubleClick.emit(e);
        });
        this._chart.on('mousedown', e => {
            this._logEvent('mousedown', e);
            this.onMouseDown.emit(e);
        });
        this._chart.on('mouseup', e => {
            this._logEvent('mouseup', e);
            this.onMouseUp.emit(e);
        });
        this._chart.on('mouseover', e => {
            this._logEvent('mouseover', e);
            this.onMouseOver.emit(e);
        });
        this._chart.on('mouseout', e => {
            this._logEvent('mouseout', e);
            this.onClick.emit(e);
        });
        this._chart.on('globalout', e => {
            this._logEvent('globalout', e);
            this.onGlobalOut.emit(e);
        });
        this._chart.on('contextmenu', e => {
            this._logEvent('contextmenu', e);
            this.onContextMenu.emit(e);
        });
        this._chart.on('datazoom', e => {
            this._logEvent('datazoom', e);
            this.onDataZoom.emit(e);
        });

        if (!this.lazyload) {
            setTimeout(() => {
                this.render();
            });
        }
        this._initiated = true;
    }

    ngOnChanges(changes) {
        if (!this._initiated) {
            return;
        }
        if (this.lazyload && !this.lazyloadRender) {
            this._chart.clear();
            this._prevLazyloadRender = this.lazyloadRender;
            return;
        }
        // Unless the options' value has been exactly changed, we will not launch a new rendering process, which
        // improves performance while using a dynamically constructed data source.
        if (this.options && this._prevOptions && JSON.stringify(this.options) === JSON.stringify(this._prevOptions)
        && this._prevLazyloadRender === this.lazyloadRender) {
            return;
        }
        setTimeout(() => {
            this.render();
        });
        // Since a simple duplicated instance of options still has pointers to its origin's properties, we use
        // a complete deepcopy instead.
        this._prevOptions = JSON.parse(JSON.stringify(this.options));
        this._prevLazyloadRender = this.lazyloadRender;
    }

    ngOnDestroy() {
        if (this.sizeCheckInterval) {
            clearInterval(this.sizeCheckInterval);
        }
        this.reSize$.complete();
        if (this._onResize) {
            this._onResize.unsubscribe();
        }
        this._chart.dispose();
        // if (this.chart) {
        //     this.chart.dispose();
        //     this.chart = null;
        // }
    }

    get chart(): ECharts {
        return this._chart;
    }
}

export class ChartResizeEvent {
    width: number;
    height: number;
}

export class ChartControl {
    chart?: ECharts;
}