/**
 * 是否支持fetch方法
 */
export function isSupportFetch(): boolean {
    return !!window.fetch;
}

export function isFunction(what: unknown): boolean {
    return typeof what === 'function';
}

export function isType(what: unknown, type: string): boolean {
    return Object.prototype.toString.call(what).toLowerCase() === `[object ${type}]`;
}

export function isArray(what: unknown): boolean {
    return Array.isArray ? Array.isArray(what) : isType(what, 'array');
}

export function calcJsonSize(data: unknown): number {
    return JSON.stringify(data).length;
}