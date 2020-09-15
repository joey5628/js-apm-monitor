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

export interface PerformanceTimes {
    [key: string]: number;
    // 重定向耗时
    redirect_time: number;
    // DNS 解析耗时
    dns_time: number;
    // TCP 连接耗时
    tcp_time: number;
    // SSL 安全连接耗时
    ssl_time: number;
    // 网络请求耗时 (TTFB) 读取到第一个字节的时间
    ttfb_time: number;
    // 数据传输耗时
    response_time: number;
    // DOM 解析耗时
    dom_analysis_time: number;
    // 资源加载耗时
    resources_time: number;
    // 首包时间
    firstbyte_time: number;
    // First Paint Time, 首次渲染时间 / 白屏时间
    fpt_time: number;
    // 首次可交互时间
    tti_time: number;
    // HTML 加载完成时间， 即 DOM Ready 时间
    dom_ready_time: number;
    // 页面完全加载时间
    load_time: number;
}

export interface ResourceInfo {
    script_count?: number;
    script_load_time?: number;
    style_count?: number;
    style_load_time?: number;
    img_count?: number;
    img_load_time?: number;
}
