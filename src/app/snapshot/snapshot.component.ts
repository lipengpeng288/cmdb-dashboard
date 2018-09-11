import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { MachineSnapshot, DataService } from '@core';
import { Subscription } from 'rxjs';
import { HeaderService } from '../header';

@Component({
    selector: 'app-snapshot',
    templateUrl: './snapshot.component.html',
    styleUrls: ['./snapshot.component.scss']
})
export class AppSnapshotComponent implements OnInit, OnDestroy {
    name: string;
    data: MachineSnapshot;
    
    private _subscription: Subscription;

    constructor(
        private route: ActivatedRoute,
        private _header: HeaderService,
        private _data: DataService,
    ) {
        this.route.paramMap.subscribe(
            (params: ParamMap) => {
                this.name = decodeURI(params.get('name'));
                this._header.title = `Snapshot - ${this.name}`;
            }
        )
    }

    ngOnInit() {
        this._subscription = this._data.queryMachineSnapshot(this.name).subscribe((data) => {
            this.data = data;
        });
    }

    ngOnDestroy() {
        this._subscription.unsubscribe();
    }
}
