/**
 * 监控需要的配置参数接口
 * @export
 * @interface Options
 */
export interface Options {
    url: string;
    logStorageKey: string;
    maxStorageSize: number;
    monitor: {
        performance: boolean;
        requestPerformance: boolean;
        jsError: boolean;
        consoleError: boolean;
        resourceError: boolean;
        requestError: boolean;
    }
}

/**
 * 需要上报的log日志格式
 * @export
 * @interface LogData
 */
export interface LogData {
    [key: string]: string | number | undefined
}

/**
 * 页面信息接口
 *
 * @export
 * @interface PageInfo
 */
export interface PageInfo {
    path: string;
    page_name: string;
    page_width: number;
    page_height: number;   
}

/**
 *客户端信息接口
 *
 * @export
 * @interface ClientInfo
 */
export interface ClientInfo {
    useragent?: string;
    client_os?: string;
    client_os_version?: string;
    network?: string;
    browser?: string;
    browser_version?: string;
    screen_width?: number;
    screen_height?: number;
}
