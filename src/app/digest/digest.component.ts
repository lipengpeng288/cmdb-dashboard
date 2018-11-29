import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { DataSource } from '@angular/cdk/table';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { Subscription } from 'rxjs';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { HeaderService } from '../header';
import { DataService } from '@core';
import { filterAny, sortingDataAccessor, deepCopy } from '@core/utils';


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

    rackNames: Array<any> = [];
    displayLocationData: boolean;
    displayLoData: object;
    zIndex: Array<number>;
    setRight: string;
    setBottom: string;

    constructor(
        private _header: HeaderService,
        private _data: DataService
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
            this.handleocation();
            this.setzIndex();
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

    get locationData():any{
        return deepCopy(this.dataSource.data);   
    }

    handleocation(){
        let data = this.locationData;
        let types = [];
        for(var i in data){
            if(types.indexOf(data[i].location.rack_name) === -1){
                types.push(data[i].location.rack_name);
            }
        }
        for(let i = 0;i < types.length;i++){
            if(types[i] == undefined){
                types.splice(i,1)
            }
        }
        types = types.sort();  
        //一个包含多个list的结果数组
        let arr = [];
        let ar = [];
        //根据type生成多个数组
        for(let k in types){
            for(let j in data){
                if(data[j].location.rack_name == types[k]){
                    arr[types[k]] = arr[types[k]] || [];
                    arr[types[k]].push(data[j]);
                }
            }
            //将数组按照rack_slot从大到小排序
            let array = arr[types[k]];
            for(let i = 0;i < array.length-1;i++){
                for(let j = 0;j < array.length-i-1;j++){
                    if(parseInt(array[j].location.rack_slot) > parseInt(array[j+1].location.rack_slot)){
                        var swap = array[j];
                        array[j] = array[j+1];
                        array[j+1] = swap;
                    }
                }
            }
            ar.push(array);
        }   
        this.rackNames = ar;
    }
    setzIndex(){
        let arr = [];
        let num=100000;
        for(let i = num;i> 0;i--){
            arr.push(i);
        }
        this.zIndex = arr;
    }
    setLoactionPosition(e,j){
        let offsetx = e.clientX;
        if(innerWidth -(offsetx+110) < 200){
            this.setRight = "-200px";
            for(let i = j-1;i >=0;i-- ){
                this.zIndex[i] -= 2;
            }
            
        }else{
            this.setRight = "110px";
        }
        if(e.clientY<150){
           this.setBottom = 10+'px';
        }
        if((offsetx-100)<200 && innerWidth -(offsetx+110) < 200){
            this.setRight = '0px';
            this.setBottom = '10px';
        } 
        if(innerHeight-e.clientY < 200){
            this.setBottom = '-150px';
            for(let i = j-1;i >=0;i-- ){
                this.zIndex[i] -= 2*i;
            }
        }
    }

    resetLoactionPosition(e,j){
        if(this.zIndex[j] > this.zIndex[j-1] ){
           this.setzIndex();
        }
    }
}
