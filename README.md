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

## 日志字段
### 基础字段
| 字段名 | 中文名 | 解释 |
|----|----|-----|
|useragent|UA||
|client_os|客户端系统||
|client_os_version|客户端系统版本好||
|network|网络类型||
|browser|浏览器名称||
|browser_version|浏览器版本号||
|screen_width|屏幕宽度||
|screen_height|屏幕高度||


### 性能日志字段

| 字段名 | 中文名 | 解释 |
|----|----|-----|
|redirect_time|重定向耗时||
|dns_time|DNS 解析耗时||
|tcp_time|TCP 连接耗时||
|ssl_time|SSL 安全连接耗时||
|ttfb_time|网络请求耗时|读取到第一个字节的时间|
|response_time|数据传输耗时||
|dom_analysis_time|DOM 解析耗时||
|resources_time|资源加载耗时||
|firstbyte_time|首包时间||
|fpt_time|首次渲染时间||
|tti_time|首次可交互时间|单页应用此时还不可交互|
|dom_ready_time|DOM Ready 时间||
|load_time|页面完全加载时间|参考价值不大，部分图片可能加载很慢|
|资源加载性能|
|script_count|JS资源数量||
|script_load_time|所有JS加载耗时||
|style_count|样式资源数量||
|style_load_time|所有样式加载耗时||
|img_count|图片资源数量||
|img_load_time|所有图片加载耗时||

### 异常日志字段

| 字段名 | 中文名 | 值 |
|----|----|-----|
|error_type|错误类型|（script \| unhandledrejection \| resource \| consoleError \| fetch \| ajax）|
|error_level|错误等级|error|
|error_url|报错文件||
|error_lineno|报错行||
|error_colno|报错列||
|error_stack|报错堆栈||
|error_msg|错误详情||
||||
||||
||||















