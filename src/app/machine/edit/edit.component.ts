import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSlideToggleChange } from '@angular/material';
import { Machine } from '@core';
import * as YAML from 'yamljs';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { BehaviorSubject, Subscription } from 'rxjs';
import { deepCopy, deepEqual } from '@core/utils';
import { MachineOverridableInfo } from '@core/service/types';

@Component({
    selector: 'app-machine-edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.scss']
})
export class AppMachineEditComponent implements OnInit, OnDestroy {

    private _obj = new Machine();
    private _yaml: string;
    private formStream: Subscription;
    private yamlStream: Subscription;
    private yamlChange: BehaviorSubject<string> = new BehaviorSubject('');

    create: boolean;
    form: FormGroup;
    formErrors: {
        [key: string]: any;
    };
    get yaml(): string {
        return this._yaml;
    }
    set yaml(s: string) {
        this._yaml = s;
        this.yamlChange.next(s);
    }
    yamlErrors: {
        [key: string]: string;
    };
    debug: boolean = false;
    hidePassword = true;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: Machine,
        public dialogRef: MatDialogRef<AppMachineEditComponent>,
        private fb: FormBuilder,
    ) {
        this.formErrors = {
            name: {},
            ssh_address: {},
            ssh_port: {},
            ssh_user: {},
            ipmi_addr: {},
            ipmi_user: {},
            ipmi_pass: {},
            comment: {},
            department: {},
            rack_name: {},
            rack_slot: {},
        };
        this.yamlErrors = {};
    }

    ngOnInit() {
        if (this.data) {
            this._obj = deepCopy(this.data);
            this.create = false;
        } else {
            this._obj.ssh_user = 'root';
            this._obj.ssh_port = 22;
            this.create = true;
        }
        this._obj.metadata = (this._obj.metadata)? this._obj.metadata: {};
        this._obj.extra_info = (this._obj.extra_info)? this._obj.extra_info: {};
        this._obj.extra_info.location = (this._obj.extra_info.location)? this._obj.extra_info.location: {};
        this.form = new FormGroup({
            metadata: new FormGroup({
                name: new FormControl({value: this._obj.metadata.name, disabled: !this.create}, [Validators.required]),
            }),
            ssh_addr: new FormControl(this._obj.ssh_addr, [Validators.nullValidator]),
            ssh_port: new FormControl(this._obj.ssh_port, [Validators.required, Validators.min(1), Validators.max(65535)]),
            ssh_user: new FormControl(this._obj.ssh_user, [Validators.required]),
            ipmi_addr: new FormControl(this._obj.ipmi_addr, [Validators.required]),
            ipmi_user: new FormControl(this._obj.ipmi_user, [Validators.required]),
            ipmi_pass: new FormControl(this._obj.ipmi_pass, [Validators.required]),
            extra_info: new FormGroup({
                comment: new FormControl(this._obj.extra_info.comment, []),
                department: new FormControl(this._obj.extra_info.department, []),
                location: new FormGroup({
                    rack_name: new FormControl(this._obj.extra_info.location.rack_name, []),
                    rack_slot: new FormControl(this._obj.extra_info.location.rack_slot, []),
                }),
            }),
        });
        this.formStream = this.form.valueChanges.subscribe(() => {
            this.onFormChange();
        });
        this.yamlStream = this.yamlChange.subscribe((data) => {
            this.onYAMLChange(data);
        });
    }

    ngOnDestroy() {
        this.formStream.unsubscribe();
        this.yamlStream.unsubscribe();
    }
    
    apply() {
        this.save(this.debug);
        if (!this.create && this.data && JSON.stringify(this.data.metadata) !== JSON.stringify(this._obj.metadata)) {
            this._obj.metadata = this.data.metadata;
        }
        if (deepEqual(this._obj, this.data)) {
            this.abort();
            return;
        }
        this.dialogRef.close(this.object);
    }

    abort() {
        this.dialogRef.close();
    }

    get hasYAMLErrors(): boolean {
        let errs = 0;
        for (let field in this.yamlErrors) {
            if (!this.yamlErrors.hasOwnProperty(field)) {
                continue;
            }
            errs++;
        }
        return errs > 0;
    }

    toggleMode(event: MatSlideToggleChange) {
        this.save(!event.checked);
        if (event.checked) {
            this.yaml = YAML.stringify(this.object, 4, 2);
        } else {
            const obj = new Machine();
            obj.metadata = {name: this.object.metadata.name};
            if (this.object.ssh_addr) {
                obj.ssh_addr = this.object.ssh_addr;
            } else {
                obj.ssh_addr = null;
            }
            obj.ssh_port = this.object.ssh_port;
            obj.ssh_user = this.object.ssh_user;
            obj.ipmi_addr = this.object.ipmi_addr;
            obj.ipmi_user = this.object.ipmi_user;
            obj.ipmi_pass = this.object.ipmi_pass;
            obj.extra_info = {
                comment: (this.object.extra_info && this.object.extra_info.comment)? this.object.extra_info.comment: null,
                department: (this.object.extra_info && this.object.extra_info.department)? this.object.extra_info.department: null,
                location: {
                    rack_name: (this.object.extra_info && this.object.extra_info.location && this.object.extra_info.location.rack_name)? this.object.extra_info.location.rack_name: null,
                    rack_slot: (this.object.extra_info && this.object.extra_info.location && this.object.extra_info.location.rack_slot)? this.object.extra_info.location.rack_slot: null,
                },
            };
            this.form.setValue(obj);
        }
        this.debug = event.checked;
    }

    private save(yaml: boolean) {
        if (yaml) {
            this._obj = YAML.parse(this.yaml);
        } else {
            this._obj.metadata.name = this.form.get('metadata.name').value;
            const ssh_addr = this.form.get('ssh_addr').value;
            if (ssh_addr) {
                this._obj.ssh_addr = ssh_addr;
            } else {
                delete this._obj['ssh_addr'];
            }
            this._obj.ssh_port = this.form.get('ssh_port').value;
            this._obj.ssh_user = this.form.get('ssh_user').value;
            this._obj.ipmi_addr = this.form.get('ipmi_addr').value;
            this._obj.ipmi_user = this.form.get('ipmi_user').value;
            this._obj.ipmi_pass = this.form.get('ipmi_pass').value;
            const comment = this.form.get('extra_info.comment').value;
            if (comment) {
                this._obj.extra_info.comment = this.form.get('extra_info.comment').value;
            } else {
                delete this._obj.extra_info['comment'];
            }
            const department = this.form.get('extra_info.department').value;
            if (department) {
                this._obj.extra_info.department = department;
            } else {
                delete this._obj.extra_info['department'];
            }
            this._obj.extra_info.location = (this._obj.extra_info.location)? this._obj.extra_info.location: {};
            const rack_name = this.form.get('extra_info.location.rack_name').value;
            if (rack_name) {
                this._obj.extra_info.location.rack_name = rack_name;
            } else {
                delete this._obj.extra_info.location['rack_name'];
            }
            const rack_slot = this.form.get('extra_info.location.rack_slot').value;
            if (rack_slot) {
                this._obj.extra_info.location.rack_slot = rack_slot;
            } else {
                delete this._obj.extra_info.location['rack_slot'];
            }
        }
    }

    private onFormChange() {
        if (this.debug) {
            return;
        }
        for (let field in this.formErrors) {
            if (!this.formErrors.hasOwnProperty(field)) {
                continue;
            }
            // Clear previous errors
            this.formErrors[field] = {};
            // Get the control
            const control = this.form.get(field);
            if (control && control.dirty && !control.valid) {
                this.formErrors[field] = control.errors;
            }
        }
    }

    private onYAMLChange(s: string) {
        if (!this.debug || !s) {
            return;
        }
        this.yamlErrors = {};
        let obj: Machine;
        try {
            obj = YAML.parse(s);
        } catch (e) {
            this.yamlErrors.yaml = 'Invalid syntax.';
            return;
        }
        if (!obj) {
            this.yamlErrors.yaml = 'Empty value is not allowed.';
            return;
        }
        if (!this.create && !deepEqual(this.object.metadata, obj.metadata)) {
            this.yamlErrors.metadata = 'Metadata is not allowed to be modified during update.';
            return;
        }
        obj.metadata = (obj.metadata)? obj.metadata: {};
        if (!obj.metadata.name) {
            this.yamlErrors.name = 'Name (metadata.name) is required.';
        } else {
            const regexp = new RegExp('^[a-zA-Z]{1}[A-Za-z0-9_]*$');
            if (!regexp.test(obj.metadata.name)) {
                this.yamlErrors.name = 'Name must be alphanumeric and starts with alphabet.';
            }
        }
        if (obj.ssh_addr) {
            const regexp = new RegExp('^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$');
            if (!regexp.test(obj.ssh_addr)) {
                this.yamlErrors.ssh_addr = 'SSH address must be a valid IP address.';
            }
        }
        if (!obj.ssh_port) {
            this.yamlErrors.ssh_port = 'SSH port is required.';
        } else if (obj.ssh_port <= 0 || obj.ssh_port > 65535) {
            this.yamlErrors.ssh_port = 'SSH port must be an integer between 1 and 65535.';
        }
        if (!obj.ssh_user) {
            this.yamlErrors.ssh_user = 'SSH user is required';
        } else {
            const regexp = new RegExp('^[a-zA-Z]{1}[A-Za-z0-9_]*$');
            if (!regexp.test(obj.ssh_user)) {
                this.yamlErrors.ssh_user = 'SSH user name must be alphanumeric and starts with alphabet.';
            }
        }
        if (!obj.ipmi_addr) {
            this.yamlErrors.ipmi_addr = 'IPMI address is required.';
        } else {
            const regexp = new RegExp('^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$');
            if (!regexp.test(obj.ipmi_addr)) {
                this.yamlErrors.ipmi_addr = 'IPMI address must be a valid IP address.';
            }
        }
        if (!obj.ipmi_user) {
            this.yamlErrors.ipmi_user = 'IPMI user is required.';
        } else {
            const regexp = new RegExp('^[a-zA-Z]{1}[A-Za-z0-9_]*$');
            if (!regexp.test(obj.ipmi_user)) {
                this.yamlErrors.ipmi_user = 'IPMI user name must be alphanumeric and starts with alphabet.';
            }
        }
        if (!obj.ipmi_pass) {
            this.yamlErrors.ipmi_pass = 'IPMI password is required.';
        } else {
            const regexp = new RegExp('^[^ \f\n\r\t\v\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]+$');
            if (!regexp.test(obj.ipmi_pass)) {
                this.yamlErrors.ipmi_pass = 'IPMI password shall not be omitted or contains whitespaces.';
            }
        }
    }

    private get object(): Machine {
        return this._obj;
    }
    private set object(obj: Machine) {
        this._obj = obj;
        const prop = Object.getOwnPropertyNames(this._obj);
        for (let i = 0; i < prop.length; i++) {
            let name = prop[i];
            if (this._obj[name] === null || this._obj[name] === undefined) {
                delete this._obj[name];
            }
        }
    }

    get YAMLErrorMsg(): string[] {
        const prop = Object.getOwnPropertyNames(this.yamlErrors);
        let msg: string[] = [];
        if (!prop.length) {
            return null;
        }
        for (let i = 0; i < prop.length; i++) {
            msg.push(`${prop[i]}: ${this.yamlErrors[prop[i]]}`);
        }
        return msg;
    }
}