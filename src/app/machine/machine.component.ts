import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { HeaderService } from '../header';
import { Machine, DataService } from '@core';
import { Subscription, Observable } from 'rxjs';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { AppMachineEditComponent } from './edit';
import { AppMachineConfirmComponent } from './confirm';
import { filterAny, sortingDataAccessor } from '@core/utils';

@Component({
    selector: 'app-machine',
    templateUrl: './machine.component.html',
    styleUrls: ['./machine.component.scss'],
    entryComponents: [
        AppMachineEditComponent,
        AppMachineConfirmComponent
    ]
})
export class AppMachineComponent implements OnInit, OnDestroy {

    displayedColumns: string[] = [
        'select', 'metadata.name', 'ssh_addr', 'ssh_port', 'ssh_user', 'ipmi_addr', 'ipmi_user',
        'ipmi_pass', 'view'
    ];
    dataSource: MatTableDataSource<Machine>;
    selection = new SelectionModel<Machine>(true, []);
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    private subscription: Subscription;

    constructor(
        public dialog: MatDialog,
        private _header: HeaderService,
        private _data: DataService,
    ){}

    ngOnInit() {
        this._header.title = 'Machine Management';
        this.subscription = this._data.fetchMachine('*').subscribe((data) => {
            this.dataSource = new MatTableDataSource(data);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sortingDataAccessor = sortingDataAccessor;
            this.dataSource.sort = this.sort;
            this.dataSource.filterPredicate = filterAny;
        });
        this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
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

    create() {
        let ref = this.dialog.open(AppMachineEditComponent, {disableClose: true, data: null});
        ref.afterClosed().subscribe((obj) => {
            if (!obj) {
                return;
            }
            this._data.createMachine(obj).subscribe((data) => {
                // MatTableDataSource's data is indeed a callback fn, so we must copy it first, and then
                // assign its value with the updated one.
                let dump = this.dataSource.data;
                dump.push(data);
                this.dataSource.data = dump;
            }, (err) => {
                // TODO: ERROR SHALL BE PROMPT ONTO SCREEN!
                console.error(err);
            });
        });
    }

    update(obj: Machine) {
        let ref = this.dialog.open(AppMachineEditComponent, {disableClose: true, data: obj});
        ref.afterClosed().subscribe((updated) => {
            if (!updated) {
                return;
            }
            this._data.updateMachine(updated).subscribe((data) => {
                if (!obj) {
                    return;
                }
                for (let i in this.dataSource.data) {
                    if (this.dataSource.data[i].metadata.name === data.metadata.name) {
                        let dump = this.dataSource.data;
                        dump[i] = data;
                        this.dataSource.data = dump;
                        break;
                    }
                }
            }, (err) => {
                // TODO: ERROR SHALL BE PROMPT ONTO SCREEN!
                console.error(err);
            })
        });
    }

    deleteSelection() {
        let ref = this.dialog.open(AppMachineConfirmComponent, {disableClose: true, data: this.selection.selected});
        ref.afterClosed().subscribe((agreed) => {
            if (!agreed) {
                return;
            }
            let recur = (fn: (number) => Observable<void>, length: number) => {
                let index = length-1;
                if (index < 0) {
                    this.selection.clear();
                    this.refresh();
                    return;
                }
                fn(length-1).subscribe(() => {
                    recur(fn, index);
                }, (err) => {
                    console.error(err);
                });
            }
            // Delete machine recursively.
            recur((index: number) => {
                return this._data.deleteMachine(this.selection.selected[index].metadata.name);
            }, this.selection.selected.length);
        });
    }

    delete(obj: Machine) {
        let ref = this.dialog.open(AppMachineConfirmComponent, {disableClose: true, data: [obj]});
        ref.afterClosed().subscribe((agreed) => {
            if (!agreed) {
                return;
            }
            const name = obj.metadata.name;
            this._data.deleteMachine(name).subscribe(() => {
                for (let i in this.dataSource.data) {
                    if (this.dataSource.data[i].metadata.name === name) {
                        let dump = this.dataSource.data;
                        dump.splice(Number(i), 1);
                        this.dataSource.data = dump;
                        break;
                    }
                }
            }, (err) => {
                // TODO: ERROR SHALL BE PROMPT ONTO SCREEN!
                console.error(err);
            })
        });
    }

    refresh() {
        if (this.subscription) {
            this.subscription.unsubscribe(); // GC previous thread.
            this.subscription = null;
        }
        this.subscription = this._data.fetchMachine('*').subscribe((data) => {
            if (this.dataSource) {
                this.dataSource.data = data;
                return;
            }
            this.dataSource = new MatTableDataSource(data);
        })
    }
}