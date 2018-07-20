import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { DataObject, DataService } from '../../../@service';
import { Subscription } from 'rxjs';
import { HeaderService } from '../../header';

@Component({
    selector: 'app-host-detail',
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.scss']
})
export class AppHostDetailComponent implements OnInit, OnDestroy {
    name: string;
    data: DataObject;
    
    private _subscription: Subscription;

    constructor(
        private route: ActivatedRoute,
        private _header: HeaderService,
        private _dataSvc: DataService,
    ) {
        this.route.paramMap.subscribe(
            (params: ParamMap) => {
                this.name = decodeURI(params.get('name'));
                this._header.title = `Details - ${this.name}`;
            }
        )
    }

    ngOnInit() {
        this._subscription = this._dataSvc.query(this.name).subscribe((data) => {
            this.data = data;
        });
    }

    ngOnDestroy() {
        this._subscription.unsubscribe();
    }
}
