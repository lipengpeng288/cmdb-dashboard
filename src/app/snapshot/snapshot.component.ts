import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { MachineSnapshot, DataService } from '@core';
import { Subscription } from 'rxjs';
import { HeaderService } from '../header';
import {NestedTreeControl} from '@angular/cdk/tree';
import {MatTreeNestedDataSource} from '@angular/material/tree';
import {BehaviorSubject} from 'rxjs';
import { deepCopy } from '@core/utils';

@Component({
    selector: 'app-snapshot',
    templateUrl: './snapshot.component.html',
    styleUrls: ['./snapshot.component.scss'],
})
export class AppSnapshotComponent implements OnInit, OnDestroy {
    name: string;
    data: MachineSnapshot;
    private _subscription: Subscription;
    dataChange = new BehaviorSubject<FileNode[]>([]);
    get info(): FileNode[] { return this.dataChange.value; }
    nestedTreeControl: NestedTreeControl<FileNode>;
    nestedDataSource: MatTreeNestedDataSource<FileNode>;
    hasNestedChild = (_: number, nodeData: FileNode) => !nodeData.type;
    private _getChildren = (node: FileNode) => node.children;

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
        );

        this.nestedTreeControl = new NestedTreeControl<FileNode>(this._getChildren);
        this.nestedDataSource = new MatTreeNestedDataSource();
        this.dataChange.subscribe(data => this.nestedDataSource.data = data);
    }

    ngOnInit() {
        this._subscription = this._data.queryMachineSnapshot(this.name).subscribe((data) => {
            this.data = data;
            const x = this.buildFileTree(this.displayData, 0);
            // Notify the change.
            this.dataChange.next(x);
        });
    }

    ngOnDestroy() {
        this._subscription.unsubscribe();
    }

    get displayData(): any {
        if (!this.data) {
            return null;
        }
        const obj = deepCopy(this.data);
        for (const key in  obj) {
            //  判断是否未一个空对象，若是，去掉
            if (JSON.stringify(obj[key]) === '{}') {
                delete obj[key];
            }
        }
        delete obj.metadata;
        return obj;
    }
    buildFileTree(obj: object, level: number): FileNode[] {
        return Object.keys(obj).reduce<FileNode[]>((accumulator, key) => {
          const value = obj[key];
          const node = new FileNode();
          node.filename = key;
          if (value != null) {
            if (typeof value === 'object') {
              node.children = this.buildFileTree(value, level + 1);
            } else {
              node.type = value;
            }
          }
          return accumulator.concat(node);
        }, []);
    }

}
export class FileNode {
    children: FileNode[];
    filename: string;
    type: any;
}
