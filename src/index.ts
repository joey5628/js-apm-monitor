import { Options, LogData, ClientInfo } from './core/types';
import Reporter from './core/reporter';
import ExceptionMonitor from './monitor/exception';
import PerformanceMonitor from './monitor/performance';
import getClientInstance from './core/clientInstance';

class ApmMonitor {
    
    private reporter: Reporter;
    private exceptionMonitor: ExceptionMonitor | null;
    private performanceMonitor: PerformanceMonitor | null;

    constructor() {
        this.reporter = new Reporter();
        this.exceptionMonitor = null;
        this.performanceMonitor = null;
    }

    public init(options: Options): ApmMonitor {
        options = this.optionsMerge(options);
        this.reporter.init(options);
        this.exceptionMonitor = new ExceptionMonitor(options, this.reporter);
        this.performanceMonitor = new PerformanceMonitor(options, this.reporter);
        this.exceptionMonitor.watch();
        this.performanceMonitor.watch();
        return this;
    }

    public getClientInfo(): ClientInfo {
        return getClientInstance().getClientInfo();
    }

    public customReporter(fn: (log: LogData) => any): void {
        if (fn && typeof fn === 'function') {
            // this.reporter.sendLog = fn;
            this.reporter.sendLog = (params): any => {
                params = params || {};
                const clientInfo = this.getClientInfo();
                params = Object.assign(clientInfo, params);
                fn(params as LogData);
            };
        }
    }

    private optionsMerge(options: Options): Options {
        options = options || {};
        const defaultOptions = {
            logStorageKey: 'APM_MONITOR_LOG',
            maxStorageSize: 6000,
        };
        const defaultMonitor = {
            performance: true,
            requestPerformance: true,
            jsError: true,
            consoleError: true,
            resourceError: true,
            requestError: true,
        };
        return {
            ...defaultOptions,
            ...options,
            monitor: {
                ...defaultMonitor,
                ...options.monitor
            }
        };
    }

}

export default new ApmMonitor();