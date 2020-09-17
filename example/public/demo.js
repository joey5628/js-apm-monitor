function getTimes() {
    let times = {};
    let timing = window.performance.timing;

    if (typeof window.PerformanceNavigationTiming === 'function') {
        try {
            var nt2Timing = window.performance.getEntriesByType('navigation')[0]
            if (nt2Timing) {
                timing = nt2Timing;
            }
        } catch (err) {
            console.error(err)
        }
    }
    // console.log('timing:', timing)
    if (timing.loadEventEnd) {
        const domInteractive = timing.domInteractive || timing.domLoading
        times = {
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
        }
    }

    Object.keys(times).forEach((key) => {
        const time = times[key]
        if (time) {
            times[key] = parseFloat(time.toFixed(2), 10)
        }
    })

    console.log('times:', times)
}

function getScriptTiming() {
    const p = window.performance.getEntries();
    let jsR = p.filter(ele => ele.initiatorType === "script");
    let time = Math.max(...jsR.map((ele) => ele.responseEnd)) - Math.min(...jsR.map((ele) => ele.startTime));
    const info = {
        script_count: jsR.length,
        js_load_time: time
    }
    console.log('js info:', info)
}

function getStyleTiming() {
    const p = window.performance.getEntries();
    let jsR = p.filter(ele => {
        if (ele.initiatorType === "link") {
            return true
        }
        return false
    });
    let time = Math.max(...jsR.map((ele) => ele.responseEnd)) - Math.min(...jsR.map((ele) => ele.startTime));
    const info = {
        script_count: jsR.length,
        js_load_time: time
    }
    console.log('js info:', info)
}

function formatTiming(time) {
    return time.toFixed(2)
}

function getPerformanceTimes() {
    getTimes()
    getScriptTiming();
    getStyleTiming();
    isReported = true
}

let isReported = false

window.addEventListener('load', () => {
    if (typeof window.requestIdleCallback === 'function') {
        // @ts-ignore
        window.requestIdleCallback((deadline) => {
            if ((deadline.timeRemaining() > 0 || deadline.didTimeout) && !isReported) {
                getPerformanceTimes();
            }
        }, { timeout: this.delay });
    } else {
        setTimeout(getPerformanceTimes, this.delay);
    }
})

