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

export class GenericObject {
    metadata?: ObjectMeta;
}

export class ObjectMeta {
    guid?: string;
    kind?: string;
    name?: string;
    namespace?: string;
    created_at?: Date;
    updated_at?: Date;
}

export class Machine implements GenericObject {
    metadata?: ObjectMeta;

    ssh_addr?: string;
    ssh_port?: number;
    ssh_user?: string;
    ipmi_addr?: string;
    ipmi_user?: string;
    ipmi_pass?: string;
    extra_info?: MachineOverridableInfo;
}

export class MachineSnapshot implements GenericObject, MachineOverridableInfo {
    metadata?: ObjectMeta;

    manufacturer?: string;
    model?: string;
    serial_number?: string;

    os?: string;
    type?: string;
    department?: string;
    comment?: string;
    location?: MachineLocation;
    cpu?: MachineCPUInfo;
    memory?: MachineMemInfo;
    storage?: MachineStorageInfo;
    network?: MachineNetworkInfo;
}

export class MachineOverridableInfo {
    os?: string;
    type?: string;
    department?: string;
    comment?: string;
    location?: MachineLocation;
    cpu?: MachineCPUInfo;
    memory?: MachineMemInfo;
    storage?: MachineStorageInfo;
    network?: MachineNetworkInfo;
}

export class MachineLocation {
    datacenter?: string;
    room_name?: string;
    asile?: string;
    rack_name?: string;
    rack_slot?: string;
    device_size?: string;
}

export class MachineCPUInfo {
    model?: string;
    base_freq?: string;
    count?: number;
    cores?: number;
    threads?: number;
}

export class MachineMemInfo {
    installed_memory?: string;
    populated_dimms?: number;
    maximum_dimms?: number;
}

export class MachineStorageInfo {
    virtual_disks?: VirtualDisk[];
    physical_disks?: PhysicalDisk[];
}

export class MachineNetworkInfo {
    primary_ip_address?: string;
    ipmi_address?: string;
    logical_intfs?: LogicalInterface[];
}

export class VirtualDisk {
    description?: string;
    layout?: string;
    media_type?: string;
    name?: string;
    size?: string;
    state?: string;
    status?: string;
}

export class PhysicalDisk {
    description?: string;
    media_type?: string;
    name?: string;
    serial_number?: string;
    size?: string;
    state?: string;
    status?: string;
}

export class LogicalInterface {
    members?: LogicalInterfaceMember[];
    name?: string;
    type?: string;
}

export class LogicalInterfaceMember {
    mac_address?: string;
    name?: string;
}
