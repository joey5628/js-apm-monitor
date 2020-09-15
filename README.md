# `js-apm-monitor` 
> H5性能和异常监控器
# 性能监控

# 异常监控
## 前言
随着我们业务中越来越多的使用H5页面，一些细小的异常或者特定机型的兼容性异常都可能影响大量的用户群体。指望测试做全面覆盖的测试也是不现实的，B端的问题可能还有用内部人员报上来，但是C端的异常轻则引起用户使用不悦，重则导致产品无法使用。  
这就需要我们有异常的监控体系，将用户使用时的错误日志上报。在后端可以通过图表的形式展示异常的变化趋势，这样我们也能知道那个版本导致异常上升，对应的去修改。  

那么前端有哪些错误能去做监控了？  
前端的监控大体分为如下三种：
* JS运行时错误
* 资源加载错误
* 接口错误  

## JS运行时错误
### window.onerror
JS运行时错误可以通过 window.onerror 和 window.addEventListener('error', () => {}) 两种方式来捕获，其中 window.onerror 的含有的error信息更详情，兼容性更好，所以一般JS运行时错误都是用 window.onerror 来捕获。
```typescript
window.onerror = function (message, source, lineno, colno, error): void {
    let msg = '';
    if (error && error.stack) {
        msg = error.stack;
    } else if (typeof message === 'string') {
        msg = message;
    }
    // 上报代码
    if (originOnError && isFunction(originOnError)) {
        originOnError.apply(window, [message, source, lineno, colno, error]);
    }
};
```

### 跨域JS
对于跨域的JS资源，window.onerror 拿不到详细的信息，只能得到一个字符串 <span style="color: red;">Script error</span>。因为浏览器实现script资源加载的地方，是进行了同源策略判断的，目的是避免数据错误信息里面包含的信息泄露到不安全的域中。如果是非同源资源，errorMessage就固定为 Script error。

如何解决脚本的跨域报错问题？
* 所有的资源统一在一个域名下
* 在脚本文件的 HTTP response header 中设置CORS。
> 讲脚本文件请求的Access-Control-Allow-Origin设置为”*”或者需要支持的域名
```code
header('Access-Control-Allow-Origin: *');
```
> 前端在script标签中加入crossorigin属性。
```html
<script src="app.ed39aff0.js" crossorigin></script>
```

### Promise异常
window.onerror 和 window.addEventListener('error', ()=>{}) 都不能捕获Promise 中的异常。当 Promise 被reject并且错误信息没有被处理的时候，会抛出一个unhandledrejection；可以对 unhandledrejection 进行监听，用来全局监听Uncaught Promise Error。
```js
window.addEventListener('unhandledrejection', function (event) {
    if (event) {
        const reason = event.reason;
        reporter.sendLog({
            error_type: 'unhandledrejection',
            error_level: 'error',
            error_msg: reason
        });
    }
}, true);
```

### console.error
可以通过重写console.error 来监控所有通过 console.error 发出的异常，并进行上报。也可以主动在try catch 的catch语句中主动调用上报方法来上报。
```ts
consoleWatcher(): void {
    if (!window.console || !window.console.error) return;
    const originConsoleError = window.console.error;
    window.console.error = (...args: []): void => {
        // your report code
        originConsoleError && originConsoleError.apply(window, args);
    };
}
```
至此我们基本完成了JS运行时错误的监控。

## 资源加载错误
当一项资源（如图片或脚本）加载失败，加载资源的元素会触发一个 Event 接口的 error 事件，并执行该元素上的onerror() 处理函数。这些 error 事件不会向上冒泡到 window 能被单一的window.addEventListener 捕获，window.onerror捕获不到资源加载错误。 不过 window.addEventListener 也可以捕获到JS运行时错误，这里我们需要过滤掉。
```ts
window.addEventListener('error', (event) => {
    if (event) {
        const target = event.target || event.srcElement;
        const isElementTarget = target instanceof HTMLScriptElement || target instanceof HTMLLinkElement || target instanceof HTMLImageElement;
        // js error不再处理
        if (!isElementTarget) return; 
        
        if (target) {
            // @ts-ignore
            const url = (target.src || target.href) || '';
            // your reporter code
        }
    }
}, true);
```

## 接口错误
web端所有的请求都是基于 XMLHttpRequest 和 fetch 来封装的。要监控请求异常和接口返回错误，需要封装 XMLHttpRequest 和 fetch 拦截错误并上报。  
```ts
// 根据是否支持fetch来选择监控对象
requestWatcher(): void {
    if (!window.fetch) {
        this.ajaxWatcher();
    } else {
        this.fetchWatcher();
    }
}
```

### 封装fetch

```ts
fetchWatcher(): void {
    const originFetch = window.fetch;
    const reporter = this.reporter;
    window.fetch = function (input: RequestInfo, init: RequestInit | undefined): Promise<Response>{
        const fetchReq: Promise<Response> = originFetch.call(window, input, init);
        let url: string;
        if (input instanceof Request) {
            url = input.url;
        } else { // 直接转一个URL 例如：fetch('http://example.com/movies.json')
            url = input;
        }
        fetchReq.then(res => {
            if (!res.ok) {
                // your report code
            }
        }).catch(error => {
            // your report code
            throw error;
        });
        return fetchReq;
    };
}
```

### 封装XMLHttpRequest 

```ts
ajaxWatcher(): void {
    if (!window.XMLHttpRequest) return;
    const originXhr = window.XMLHttpRequest;
    const originSend = originXhr.prototype.send;

    const handleEvent = (event: Event): void => {
        if (event) {
            const currentTarget: XMLHttpRequest = event.currentTarget as XMLHttpRequest;
            const target: XMLHttpRequest = event.target as XMLHttpRequest;
            if (currentTarget && currentTarget.status !== 200) {
                // your report code
            }
        }
    };

    originXhr.prototype.send = function(...args) {
        if (!this.addEventListener) {
            this.addEventListener('error', handleEvent);
            this.addEventListener('load', handleEvent);
            this.addEventListener('abort', handleEvent);
        } else {
            const originStateChange = this.onreadystatechange;
            this.onreadystatechange = function(event): void {
                if (this.readyState === 4) {
                    handleEvent(event);
                }
                originStateChange && originStateChange.call(this, event);
            };
        }
        return originSend.apply(this, args);
    };
}
```

至此异常的监控就已完成。

TODO
- [ ] React 和 Vue 异常监控
- [ ] iframe 的异常监控











# 日志上报服务