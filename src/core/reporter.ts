/*
 * @Author: Joey
 * @Date: 2020-09-03 10:59:02
 * @LastEditTime: 2020-09-21 17:27:42
 * @Description: 
 * @FilePath: /js-apm-monitor/src/core/reporter.ts
 */
import { Options, LogData } from './types';
import * as storage from './storage';
import { isArray, calcJsonSize } from './utils';
import request from './request';

class Reporter {
    static instance: Reporter | null;
    private lock: Promise<unknown> | null;

    public options: Options;

    constructor(options: Options) {
        this.lock = null;
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
        const { logStorageKey, maxStorageSize } = this.options;

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
        console.log('sendLog params:', params);
        if (params && !isArray(params)) {
            params = [params as LogData];
        }
        return request.post(this.options.url, params)
            .then(() => {
                return storage.remove(this.options.logStorageKey);
            })
            .catch((error: any) => {
                console.log('upload log error:', error);
            });
    }

    // static getInstance() {
    //     if (!this.instance) {
    //         this.instance = new Reporter();
    //     }
    //     return this.instance;
    // }
}

// export default Reporter.getInstance();
export default Reporter;