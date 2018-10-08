import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Machine } from '@core';
import * as YAML from 'yamljs';

@Component({
    selector: 'app-machine-confirm',
    templateUrl: './confirm.component.html',
    styleUrls: ['./confirm.component.scss']
})
export class AppMachineConfirmComponent implements OnInit {

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: Machine[],
        public dialogRef: MatDialogRef<AppMachineConfirmComponent>,
    ) {}

    ngOnInit() { }

    agree() {
        this.dialogRef.close(true);
    }

    abort() {
        this.dialogRef.close();
    }
}
