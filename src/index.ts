import { Options } from './core/types';
import Reporter from './core/reporter';
import ExceptionMonitor from './monitor/exception';
import PerformanceMonitor from './monitor/performance';

class ApmMonitor {
    
    private reporter: Reporter;
    private exceptionMonitor: ExceptionMonitor | null;
    private performanceMonitor: PerformanceMonitor | null;

    constructor() {
        this.reporter = new Reporter();
        this.exceptionMonitor = null;
        this.performanceMonitor = null;
    }

    init(options: Options): void {
        if (options && options.url) {
            options = this.optionsMerge(options);
            this.reporter.init(options);
            this.exceptionMonitor = new ExceptionMonitor(options, this.reporter);
            this.performanceMonitor = new PerformanceMonitor(options, this.reporter);
            this.exceptionMonitor.watch();
            this.performanceMonitor.watch();
        }
    }

    private optionsMerge(options: Options): Options {
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