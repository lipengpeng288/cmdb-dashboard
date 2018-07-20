import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { DataSource } from '@angular/cdk/table';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { Subscription } from 'rxjs';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { HeaderService } from '../header';
import { DataService } from '../../@service';

@Component({
    selector: 'app-host',
    templateUrl: './host.component.html',
    styleUrls: ['./host.component.scss'],
    animations: [
        trigger('expandDetails', [
            state('collapsed', style({ height: '0', minHeight: '0', display: 'none' })),
            state('expanded', style({ height: '*' })),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ],
})
export class AppHostComponent implements OnInit, OnDestroy {
    displayedColumns: string[] = [
        'select', 'name', 'os', 'department', 'type', 'comment', 'manufacturer', 'model', 'serial_num',
        'rack_name', 'slot_name', 'cpu_model', 'cpu_base_freq', 'cpu_count', 'cpu_cores',
        'memory_populated_dimms', 'memory_installed_capacity', 'network_primary_ip', 'network_ipmi_address'
    ];
    dataSource: MatTableDataSource<any>;
    selection = new SelectionModel<any>(true, []);
    expandedElem: any;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    private _subscription: Subscription;

    constructor(
        private _header: HeaderService,
        private _dataSvc: DataService,
    ) { }

    ngOnInit() {
        this._header.title = 'Host Overview';
        this._subscription = this._dataSvc.data.subscribe((data) => {
            this.dataSource = new MatTableDataSource(data);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
        });
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
}
