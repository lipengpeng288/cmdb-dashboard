// Copyright © 2018 Alfred Chou <unioverlord@gmail.com>
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http'; 
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Machine, MachineSnapshot } from './types';

const machine_api = '/api/v1/machine';
const digest_api = '/api/v1/machine_digest'

@Injectable({
    providedIn: 'root'
})
export class DataService {
    // cache
    private _snapshots: MachineSnapshot[];

    constructor(
        private _http: HttpClient,
    ) {}

    createMachine(by: Machine): Observable<Machine> {
        return this._http.post(machine_api, by, {
            responseType: 'json',
        });
    }

    updateMachine(by: Machine): Observable<Machine> {
        return this._http.put(machine_api, by, {
            responseType: 'json',
        });
    }

    fetchMachine(target: '*'|string[]): Observable<Machine[]> {
        let params = new HttpParams()
        if (target === '*') {
            params = params.set('search', '*');
        } else {
            params = params.set('search', target.join(','));
        }
        return this._http.get<Machine[]>(machine_api, {params: params});
    }

    deleteMachine(byName: string): Observable<void> {
        return new Observable((observer) => {
            if (byName) {
                const params = new HttpParams()
                    .set('target', byName);
                this._http.delete(machine_api, {
                    params: params,
                }).subscribe((data) => {
                    observer.next();
                }, (err) => {
                    observer.error(err);
                });
                return;
            }
            observer.error('Name was not specified');
        });
    }

    queryMachineSnapshot(name: string): Observable<MachineSnapshot> {
        return new Observable((observer) => {
            for (let i of this._snapshots) {
                if (i.metadata.namespace && i.metadata.namespace == name) {
                    observer.next(i);
                    return
                }
            }
            observer.error('Not found');
        });
    }

    fetchMachineDigest(by: Date): Observable<MachineSnapshot[]> {
        const params = new HttpParams()
            .set('scope', 'date')
            .set('target', String(Math.floor(by.getTime() / 1000)))
            .set('format', 'json');
        return this._http.get<MachineSnapshot[]>(digest_api, {params: params}).pipe(map((data) => {
            this._snapshots = data;
            return this._snapshots;
        }));
    }

    downloadMachineDigest(by: Date|number): Observable<Blob> {
        const params = new HttpParams()
            .set('scope', 'date')
            .set('format', 'xlsx');
        if (by instanceof Date) {
            params.set('target', String(Math.floor(by.getTime() / 1000)));
        } else {
            params.set('target', String(by));
        }
        return this._http.get(digest_api, {
            responseType: 'blob',
            params: params,
        });
    }
}