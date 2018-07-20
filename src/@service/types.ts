export class DataObject {
    comment?: string;
    cpu_base_freq?: string;
    cpu_cores?: number;
    cpu_count?: number;
    cpu_model?: string;
    cpu_threads?: number;
    department?: string;
    installed_memory?: string;
    ipmi_address?: string;
    logical_intfs?: LogicalInterface[];
    manufacturer?: string;
    maximum_dimms?: number;
    model?: string;
    name?: string;
    os?: string;
    physical_disks?: PhysicalDisk[];
    populated_dimms?: number;
    primary_ip_address?: string;
    rack_name?: string;
    rack_slot?: string;
    serial_number?: string;
    type?: string;
    virtual_disks?: VirtualDisk[];
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