import { Options } from '../core/types';
import Reporter from '../core/reporter';
import { isFunction } from '../core/utils';

export default class ExceptionMonitor {

    public options:Options;
    public reporter: Reporter;
    
    constructor(options: Options, reporter: Reporter) {
        this.options = options;
        this.reporter = reporter;
    }

    watch(): void {
        const monitor = this.options.monitor;
        if (monitor.jsError) {
            this.scriptWatcher();
        }
        if (monitor.resourceError) {
            this.resourceWatcher();
        }
        if (monitor.requestError) {
            this.requestWatcher();
        }
        if (monitor.consoleError) {
            this.consoleWatcher();
        }
    }

    /**
     * JS运行时异常监控
     */
    scriptWatcher(): void {
        const originOnError = window.onerror;
        const reporter = this.reporter;
        window.onerror = function (message, source, lineno, colno, error): void {
            let msg = '';
            if (error && error.stack) {
                msg = error.stack;
            } else if (typeof message === 'string') {
                msg = message;
            }
            reporter.sendLog({
                log_type: 'exception',
                error_type: 'script',
                error_level: 'error',
                error_url: source,
                error_lineno: lineno,
                error_colno: colno,
                error_stack: error && error.stack,
                error_msg: msg
            });
            if (originOnError && isFunction(originOnError)) {
                originOnError.apply(window, [message, source, lineno, colno, error]);
            }
        };

        window.addEventListener('unhandledrejection', function (event) {
            if (event) {
                const reason = event.reason;
                reporter.sendLog({
                    log_type: 'exception',
                    error_type: 'unhandledrejection',
                    error_level: 'error',
                    error_msg: reason
                });
            }
        }, true);
    }

    /**
     * 资源加载失败监控
     */
    resourceWatcher(): void {
        window.addEventListener('error', (event) => {
            if (event) {
                const target = event.target || event.srcElement;
                const isElementTarget = target instanceof HTMLScriptElement || target instanceof HTMLLinkElement || target instanceof HTMLImageElement;
                // js error不再处理
                if (!isElementTarget) return; 
                
                if (target) {
                    // @ts-ignore
                    const url = (target.src || target.href) || '';
                    this.reporter.sendLog({
                        log_type: 'exception',
                        error_type: 'resource',
                        error_level: 'error',
                        error_url: url,
                        // @ts-ignore
                        error_msg: target.nodeName
                    });
                }
            }
        }, true);
    }

    /**
     * console.error 拦截监控
     */
    consoleWatcher(): void {
        if (!window.console || !window.console.error) return;
        const originConsoleError = window.console.error;
        window.console.error = (...args: []): void => {
            this.reporter.sendLog({
                log_type: 'exception',
                error_type: 'consoleError',
                error_level: 'error',
                error_msg: JSON.stringify(args.join(',')),
            });
            originConsoleError && originConsoleError.apply(window, args);
        };
    }

    /**
     * 请求异常监控
     */
    requestWatcher(): void {
        this.ajaxWatcher();
        this.fetchWatcher();
    }

    /**
     * fetch 异常监控
     * 
     */
    fetchWatcher(): void {
        if (!window.fetch) return;
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
                    reporter.sendLog({
                        log_type: 'exception',
                        error_type: 'fetch',
                        error_level: 'error',
                        error_url: url,
                        error_msg: JSON.stringify(res),
                    });
                }
            }).catch(error => {
                reporter.sendLog({
                    log_type: 'exception',
                    error_type: 'fetch',
                    error_level: 'error',
                    error_url: url,
                    error_msg: JSON.stringify(error.msg),
                    error_stack: JSON.stringify(error.stack)
                });
                throw error;
            });
            return fetchReq;
        };
    }

    /**
     * ajax 异常监控
     */
    ajaxWatcher(): void {
        if (!window.XMLHttpRequest) return;
        const originXhr = window.XMLHttpRequest;
        const originSend = originXhr.prototype.send;

        const handleEvent = (event: Event): void => {
            if (event) {
                const currentTarget: XMLHttpRequest = event.currentTarget as XMLHttpRequest;
                const target: XMLHttpRequest = event.target as XMLHttpRequest;
                if (currentTarget && currentTarget.status !== 200) {
                    this.reporter.sendLog({
                        log_type: 'exception',
                        error_type: 'ajax',
                        error_level: 'error',
                        error_url: target.responseURL,
                        error_msg: JSON.stringify({
                            response: target.response,
                            status: target.status,
                            statusText: target.statusText
                        })
                    });
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
}