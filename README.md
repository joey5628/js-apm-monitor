# js-apm-monitor
> `js-apm-monitor` 是一个简单、轻量级的H5性能和异常监控库。致力于为H5开发者提供快捷的手段监控H5页面性能和异常的基础数据并上报。

## 设计思路
- [性能监控思路](https://github.com/joey5628/js-apm-monitor/blob/master/docs/PERFORMANCE.md)
- [异常监控思路](https://github.com/joey5628/js-apm-monitor/blob/master/docs/EXCEPTION.md)

## 特性
- 简洁的API设计，开箱即用；
- 使用 TypeScript 构建，提供可靠性；
- 一站式满足性能和异常的监控需求；
- 日志上报服务支持定制化；

## 使用
### 安装
```bash
npm install --save js-apm-monitor
```

### 使用
```js
import apmMonitor from 'js-apm-monitor';
apmMonitor.init({
    url: 'your upload url',
    monitor: {
        performance: true,  // 开启性能监控
        requestPerformance: true,   // 开启接口性能监控
        jsError: true,  // 开启JS运行异常监控
        consoleError: true, // 开启console.error 错误上报
        resourceError: true,    // 开启资源加载异常监控
        requestError: true, // 开启请求异常监控
    }
})
```

### 自定义上报方法
```js
apmMonitor.customReporter((log) => {
    // your report code
    tracker.track({
        name: 'log',
        ...log
    })
})
```















