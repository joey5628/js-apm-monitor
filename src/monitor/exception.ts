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

    scriptWatcher(): void {
        const originOnError = window.onerror;
        const reporter = this.reporter;
        window.onerror = function (message, source, lineno, colno, error): void {
            console.log('scriptWatcher args:', [message, source, lineno, colno, error]);
            let msg = '';
            if (error && error.stack) {
                msg = error.stack;
            } else if (typeof message === 'string') {
                msg = message;
            }
            reporter.sendLog({
                error_type: 'script',
                error_level: 'error',
                error_file: source,
                error_lineno: lineno,
                error_colno: colno,
                error_stack: error && error.stack,
                error_msg: msg
            });
            if (originOnError && isFunction(originOnError)) {
                originOnError.apply(window, [message, source, lineno, colno, error]);
            }
        };
    }

    resourceWatcher(): void {
        window.addEventListener('error', (event) => {
            if (event) {
                console.log('resourceWatcher event:', event);
                const target = event.target || event.srcElement;
                const isElementTarget = target instanceof HTMLScriptElement || target instanceof HTMLLinkElement || target instanceof HTMLImageElement;
                if (!isElementTarget) return; // js error不再处理
                
                if (target) {
                    // @ts-ignore
                    const url = (target.src || target.href) || '';
                    this.reporter.sendLog({
                        error_type: 'resource',
                        error_level: 'error',
                        error_file: url,
                        // @ts-ignore
                        error_msg: target.nodeName
                    });
                }
            }
        }, true);
    }

    consoleWatcher(): void {
        if (!window.console || !window.console.error) return;
        const originConsoleError = window.console.error;
        window.console.error = (...args: []): void => {
            this.reporter.sendLog({
                error_type: 'consoleError',
                error_level: 'error',
                error_msg: JSON.stringify(args.join(',')),
            });
            originConsoleError && originConsoleError.apply(window, args);
        };
    }

    requestWatcher(): void {
        console.log('requestWatcher');
    }
}