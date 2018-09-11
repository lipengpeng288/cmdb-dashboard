/**
 * filterAny search filter string recursively in given data.
 *
 * @export
 * @param {*} data The source data to be recursively searched.
 * @param {string} filter The string to search.
 * @returns {boolean} True if found.
 */
export function filterAny(data: any, filter: string): boolean {
    if (typeof data === 'string') {
        if (filterString(data, filter)) {
            return true;
        }
    } else if (Array.isArray(data)) {
        if (filterArray(data, filter)) {
            return true;
        }
    }
    if (typeof data === 'object') {
        if (filterObject(data, filter)) {
            return true;
        }
    }
    return false;
}

/**
 * filterObject search filter string recursively in given object.
 *
 * @export
 * @param {object} data The source object to be recursively searched.
 * @param {string} filter The string to search.
 * @returns {boolean} True if found.
 */
export function filterObject(data: object, filter: string): boolean {
    for (const prop in data) {
        if (!data.hasOwnProperty(prop)) {
            continue;
        }

        const value = data[prop];
        if (filterAny(value, filter)) {
            return true;
        }
    }
    return false;
}

/**
 * filterArray search filter string recursively in given array.
 *
 * @export
 * @param {Array<any>} data The source array to be searched in.
 * @param {*} filter The string to search.
 * @returns {boolean} True if found.
 */
export function filterArray(data: Array<any>, filter): boolean {
    for (const value of data) {
        if (typeof value === 'string') {
            if (filterString(value, filter)) {
                return true;
            }
        }

        if (typeof value === 'object') {
            if (filterObject(value, filter)) {
                return true;
            }
        }
    }
    return false;
}

/**
 * filterString search filter string in given data string.
 *
 * @export
 * @param {string} data The source string to search in.
 * @param {string} filter The string to search.
 * @returns {boolean} True if found.
 */
export function filterString(data: string, filter: string): boolean {
    return data.toLowerCase().includes(filter);
}