# 性能监控
H5性能的监控主要通过window.performance API来完成。performance 提供高精度的时间戳，精度可达纳秒级别，且不会随操作系统时间设置的影响。
目前市场上的支持情况：主流浏览器都支持，大可放心使用。

performance提供了两个可以获取页面性能数据的API：
[Timing API](https://developer.mozilla.org/zh-CN/docs/Web/API/Performance/timing): 通过 performance.timing 获取性能数据，不过该API已经从 Web 标准中删除，不过浏览器对它的支持确很好。  
**浏览器支持情况**  
![Timing-API-Can-Use](https://github.com/joey5628/js-apm-monitor/blob/master/docs/imgs/timing.png)

[PerformanceNavigationTiming](https://developer.mozilla.org/zh-CN/docs/Web/API/PerformanceNavigationTiming)：Web 标准API，浏览器支持性不如 Timing，但是未来趋势。  
**浏览器支持情况**  
![PerformanceNavigationTiming-API-Can-Use](https://github.com/joey5628/js-apm-monitor/blob/master/docs/imgs/timing2.png)

两个API都返回页面加载的各阶段时长，返回值基本一直，所有可以通过判断浏览器是否支持PerformanceNavigationTiming 来兼容两种API。
代码如下：
```ts
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
```
这样就可以抹平浏览器兼容性问题。

拿到 timing 对象后计算获得各阶段时间
```js
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
```

