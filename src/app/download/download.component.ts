import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { DataService } from '@core';
import { Subscription } from 'rxjs';
import { HeaderService } from '../header';

/**
 * Component that is used for downloading external contents asynchronously.
 *
 * @export
 * @class AppDownloadComponent
 * @implements {OnInit}
 */
@Component({
    selector: 'app-download',
    templateUrl: './download.component.html',
    styleUrls: ['./download.component.scss']
})
export class AppDownloadComponent implements OnInit, OnDestroy {
    display_name: string;
    private scope: string;
    private param: any;
    private save_as: string;
    private content_type: string;

    private subscription: Subscription;
    private cache: Blob;

    constructor(
        private _route: ActivatedRoute,
        private _data: DataService,
        private _header: HeaderService,
    ) {
        this._route.queryParamMap.subscribe(
            (params: ParamMap) => {
                this.scope = decodeURI(params.get('scope'));
                this.param = decodeURI(params.get('param'));
                switch (this.scope) {
                case 'digest':
                    this.display_name = 'Machine Digest Report';
                    this.save_as = 'digest_report.xlsx';
                    this.content_type = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
                    this.param = Number(this.param);
                    break;
                default:
                    console.error(`No such scope: ${this.scope}`);
                }
                this._header.title = 'Download Center';
            }
        )
    }

    ngOnInit() {
        this.download();
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    download() {
        if (this.cache) {
            this.promptDownload(this.cache);        
            return;
        }
        switch (this.scope) {
        case 'digest':
            this.subscription = this._data.downloadMachineDigest(this.param).subscribe((blob) => {
                this.cache = blob;
                this.promptDownload(this.cache);
            });
        }
    }

    private promptDownload(data: Blob) {
        const dl = document.createElement('a');
        dl.download = this.save_as;
        dl.href = window.URL.createObjectURL(data);
        //console.log("11111"+dl.href);
        dl.dataset.downloadurl = [this.content_type, this.save_as, dl.href].join(':');
        dl.click();
    }
}