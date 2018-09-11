import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { DataSource } from '@angular/cdk/table';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { Subscription } from 'rxjs';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { HeaderService } from '../header';
import { DataService } from '@core';
import { filterAny, sortingDataAccessor } from '@core/utils';

@Component({
    selector: 'app-digest',
    templateUrl: './digest.component.html',
    styleUrls: ['./digest.component.scss'],
    animations: [
        trigger('expandDetails', [
            state('collapsed', style({ height: '0', minHeight: '0', display: 'none' })),
            state('expanded', style({ height: '*' })),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ],
})
export class AppDigestComponent implements OnInit, OnDestroy {
    initiated = false;
    focused = false;
    date = new Date();
    displayedColumns: string[] = [
        'select', 'metadata.namespace', 'os', 'department', 'type', 'comment', 'manufacturer', 'model', 'serial_number',
        'location.rack_name', 'location.rack_slot', 'cpu.model', 'cpu.base_freq', 'cpu.count', 'cpu.cores',
        'memory.populated_dimms', 'memory.installed_memory', 'network.primary_ip_address', 'network.ipmi_address'
    ];
    dataSource: MatTableDataSource<any>;
    selection = new SelectionModel<any>(true, []);
    expandedElem: any;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    private _subscription: Subscription;

    constructor(
        private _header: HeaderService,
        private _data: DataService,
    ) { }

    ngOnInit() {
        this._header.title = 'Overview';
        this._subscription = this._data.fetchMachineDigest(this.date).subscribe((data) => {
            this.dataSource = new MatTableDataSource(data);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sortingDataAccessor = sortingDataAccessor;
            this.dataSource.sort = this.sort;
            this.dataSource.filterPredicate = filterAny;
            this.initiated = true;
        });
        this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    }

    ngOnDestroy() {
        this._subscription.unsubscribe();
    }

    search(value: string) {
        this.dataSource.filter = value.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    isAllSelected(): boolean {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;
        return numSelected === numRows;
    }

    toggle() {
        this.isAllSelected() ?
            this.selection.clear() :
            this.dataSource.data.forEach(row => this.selection.select(row));
    }

    get choosen_date_in_unix(): number {
        return Math.floor(this.date.getTime() / 1000)
    }

    toggleExpansion(isClick: boolean, elem: any) {
        if (isClick) {
            this.focused? this.focused = false: this.focused = true;
        } else if (this.focused) {
            return
        }
        if (this.expandedElem == elem) {
            this.expandedElem = null;
        } else {
            this.expandedElem = elem;
        }
    }
}
