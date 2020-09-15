import { PerformanceTimes, ResourceInfo, Options } from '../core/types';
import Reporter from '../core/reporter';

export default class PerformanceMonitor {

    private delay: number;
    public options:Options;
    public reporter: Reporter;
    private isReported: boolean;

    constructor(options: Options, reporter: Reporter) {
        this.options = options;
        this.reporter = reporter;
        this.delay = 2000;
        this.isReported = false;
    }

    watch(): void {
        const options = this.options;
        window.addEventListener('load', () => {
            if (options.monitor.performance) {
                // @ts-ignore
                if (typeof window.requestIdleCallback === 'function') {
                    // @ts-ignore
                    window.requestIdleCallback((deadline: any) => {
                        if ((deadline.timeRemaining() > 0 || deadline.didTimeout) && !this.isReported) {
                            this.reportPerformance();
                        }
                    }, { timeout: this.delay });
                } else {
                    setTimeout(this.getPerformanceTimes, this.delay);
                }
            }
        });
    }

    reportPerformance(): void {
        const performanceTimes = this.getPerformanceTimes();
        const scriptInfo = this.getResourceInfo('script');
        const styleInfo = this.getResourceInfo('style');
        const imgInfo = this.getResourceInfo('img');
        this.reporter.sendLog({
            ...performanceTimes,
            ...scriptInfo,
            ...styleInfo,
            ...imgInfo
        }).finally(() => {
            this.isReported = true;
        });
    }

    getPerformanceTimes(): PerformanceTimes | null {
        let timing: PerformanceTiming | PerformanceNavigationTiming = window.performance.timing;
        let domInteractive: number = timing.domLoading;

        if (typeof window.PerformanceNavigationTiming === 'function') {
            try {
                const nt2Timing = window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
                if (nt2Timing) {
                    timing = nt2Timing;
                    domInteractive = timing.domInteractive;
                }
            } catch (err) {
                console.error(err);
            }
        }

        if (timing.loadEventEnd) {
            const times: PerformanceTimes = {
                // 重定向耗时
                redirect_time: timing.redirectEnd - timing.redirectStart,
                // DNS 解析耗时: domainLookupEnd - domainLookupStart
                dns_time: timing.domainLookupEnd - timing.domainLookupStart,
                // TCP 连接耗时
                tcp_time: timing.connectEnd - timing.connectStart,
                // SSL 安全连接耗时
                ssl_time: timing.secureConnectionStart ? timing.connectStart - timing.secureConnectionStart : 0,
                // 网络请求耗时 (TTFB) 读取到第一个字节的时间
                ttfb_time: timing.responseStart - timing.requestStart,
                // 数据传输耗时
                response_time: timing.responseEnd - timing.responseStart,
                // DOM 解析耗时
                dom_analysis_time: domInteractive - timing.responseEnd,
                // 资源加载耗时
                resources_time: timing.loadEventStart - timing.domContentLoadedEventEnd,
                // 首包时间
                firstbyte_time: timing.responseStart - timing.domainLookupStart,
                // First Paint Time, 首次渲染时间 / 白屏时间
                fpt_time: timing.responseEnd - timing.fetchStart,
                // 首次可交互时间
                tti_time: domInteractive - timing.fetchStart,
                // HTML 加载完成时间， 即 DOM Ready 时间
                dom_ready_time: timing.domContentLoadedEventEnd - timing.fetchStart,
                // 页面完全加载时间
                load_time: timing.loadEventEnd - timing.fetchStart
            };

            Object.keys(times).forEach((key: string) => {
                const time = times[key];
                if (time) {
                    times[key] = parseFloat(time.toFixed(2));
                }
            });
            return times;
        }
        return null;
    }

    getResourceInfo(type: string): ResourceInfo {
        let eleType = type;
        if (type === 'style') {
            eleType = 'link';
        }
        const p = window.performance.getEntries();
        // @ts-ignore
        const files = p.filter(ele => ele.initiatorType === eleType);
        // @ts-ignore
        const time = Math.max(...files.map((ele) => ele.responseEnd)) - Math.min(...files.map((ele) => ele.startTime));
        const info: {[key: string]: number} = {};
        info[`${type}_count`] = files.length;
        info[`${type}_load_time`] = time;

        return info;
    }

}