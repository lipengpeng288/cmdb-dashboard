import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'uppercase' })
export class UppercasePipe implements PipeTransform {
    transform(value: string) {
        if (value === 'cpu') {
            return 'CPU';
        }
        if (value === 'base_freq') {
            return 'Base Frequency';
        }
        value.replace(/dimms$/i, 'DIMMs');
        value = value.replace(/ip/i, 'IP');
        const i = value.indexOf('_');
        if (i > 0) {
            const va =  value.split('_');
            for (let j = 0; j < va.length; j++) {
                va[j] = va[j].slice(0, 1).toUpperCase() + va[j].slice(1, va[j].length);
            }
            return va.join(' ');
        } else {
            return value.slice(0, 1).toUpperCase() + value.slice(1, value.length);
        }
    }
}
