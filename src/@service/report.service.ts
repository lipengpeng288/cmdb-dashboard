import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ReportService {

    constructor(
        private http: HttpClient,
    ) {}

    download(): Observable<Blob> {
        return this.http.get('/assets/report.xlsx', {
            responseType: 'blob',
            // TODO: Add query params if there are
        })
    }
}