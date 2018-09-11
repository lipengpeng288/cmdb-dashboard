import {_isNumberValue} from '@angular/cdk/coercion';

/**
 * Corresponds to `Number.MAX_SAFE_INTEGER`. Moved out into a variable here due to
 * flaky browser support and the value not being defined in Closure's typings.
 */
const MAX_SAFE_INTEGER = 9007199254740991;

/**
 * sortingDataAccessor provides a more reliable sortingDataAccessor to replace the default
 * one that is provided by Angular Material MatTableDataSource.
 *
 * @export
 * @param {*} data The data object to access data from.
 * @param {string} sortHeaderId the header ID which supports nested object property. Such as: 'metadata.name'
 * @returns {(string | number)}
 */
export function sortingDataAccessor(data: any, sortHeaderId: string): string | number {
    const ns = sortHeaderId.split('.');
    let value = data.hasOwnProperty(ns[0])? data[ns[0]]: null;
    for (let i in ns) {
        if (!value) {
            break;
        }
        if (i == "0") {
            continue
        }
        value = value.hasOwnProperty(ns[i])? value[ns[i]]: null;
    }

    if (_isNumberValue(value)) {
        const numberValue = Number(value);
  
        // Numbers beyond `MAX_SAFE_INTEGER` can't be compared reliably so we
        // leave them as strings. For more info: https://goo.gl/y5vbSg
        return numberValue < MAX_SAFE_INTEGER? numberValue : value;
    }

    return value;
}