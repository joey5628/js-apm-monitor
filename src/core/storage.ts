import { LogData } from './types';

export function set(key: string, value: LogData[]): Promise<Error | void> {
    return new Promise((resolve, reject) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch(e) {
            reject(e);
        }
        resolve();
    });
}

export function get(key: string): Promise<LogData[]> {
    return new Promise((resolve, reject) => {
        try {
            const dataStr = localStorage.getItem(key) as string; 
            if (!dataStr || !dataStr.length) {
                resolve([]);
            }
            resolve(JSON.parse(dataStr));
        } catch(e) {
            reject(e);
        }
    });
}

export function remove(key: string): Promise<Error | void> {
    return new Promise(function(resolve, reject) {
        try {
            localStorage.removeItem(key);
        } catch (e) {
            reject(e);
        }
        resolve();
    });
}