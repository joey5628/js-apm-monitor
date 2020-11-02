/*
 * @Author: Joey
 * @Date: 2020-09-03 10:59:02
 * @LastEditTime: 2020-11-02 18:40:11
 * @Description: 
 * @FilePath: /js-apm-monitor/src/core/reporter.ts
 */
import { Options, LogData } from './types';
import * as storage from './storage';
import { isArray, calcJsonSize } from './utils';
import request from './request';
import getClientInstance from '../core/clientInstance';

class Reporter {
    static instance: Reporter | null;
    private lock: Promise<unknown> | null;

    public options: Options | null;

    constructor() {
        this.lock = null;
        this.options = null;
    }

    public init(options: Options): void {
        this.options = options;
    }

    public addLog(params: LogData): void {
        // 检查锁，防止并发问题
        if (this.lock) {
            this.lock = this.lock.then(() => {
                return this.processLog(params);
            });
            return;
        }
        this.lock = this.processLog(params);
    }

    private processLog(params: LogData): Promise<any> {
        const { logStorageKey = '', maxStorageSize = 6000} = this.options as Options;

        return storage.get(logStorageKey)
            .then((currentData: LogData[]) => {
                if (currentData && !isArray(currentData)) {
                    throw new Error(`storage data format error: ${currentData}`);
                }
                if (!currentData) {
                    currentData = [];
                }
                params.logTime = Date.now();
                const dataByteSize = calcJsonSize(currentData);
                if (dataByteSize > maxStorageSize) {
                    // 上报日志数据
                    return this.sendLog(currentData);
                } else {
                    // 存储日志
                    return storage.set(logStorageKey, currentData);
                }
            });
    }

    public sendLog(params: LogData | LogData[]): Promise<any> {
        const options = this.options as Options;
        const url = options.url || '';
        if (params && !isArray(params)) {
            params = [params as LogData];
            const clientInfo = getClientInstance().getClientInfo();
            params = Object.assign(clientInfo, params);
        }
        return request.post(url, params)
            .then(() => {
                return storage.remove(options.logStorageKey);
            })
            .catch((error: any) => {
                console.log('upload log error:', error);
            });
    }
}

export default Reporter;