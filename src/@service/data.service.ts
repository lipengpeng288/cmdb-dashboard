import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 
import { Observable, of } from 'rxjs';
import { DataObject } from './types';

@Injectable({
    providedIn: 'root'
})
export class DataService {
    private _data: DataObject[];

    constructor(
        private http: HttpClient,
    ) {}

    private fetch(): Observable<any> {
        return this.http.get('/assets/report.json');
    }

    public query(hostname: string): Observable<DataObject> {
        return new Observable((observer) => {
            if (this._data) {
                for (let each of this._data) {
                    if (each.name === hostname) {
                        observer.next(each);
                    }
                }
            }
            observer.complete();
        });
    }

    public get data(): Observable<DataObject[]> {
        if (this._data) {
            return of(this._data);
        }
        return new Observable((observer) => {
            this.fetch().subscribe((data) => {
                this._data = data;
                observer.next(this._data);
                observer.complete();
            }, (err) => {
                observer.error(err);
            })
        });
    }

}

