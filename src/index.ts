import { Options } from './core/types';
import Reporter from './core/reporter';
import ExceptionMonitor from './monitor/exception';
import PerformanceMonitor from './monitor/performance';

export default class ApmMonitor {
    
    private reporter: Reporter | null;
    private exceptionMonitor: ExceptionMonitor | null;
    private performanceMonitor: PerformanceMonitor | null;

    constructor() {
        this.reporter = null;
        this.exceptionMonitor = null;
        this.performanceMonitor = null;
    }

    init(options: Options): void {
        this.reporter = new Reporter(options);
        this.exceptionMonitor = new ExceptionMonitor(options, this.reporter);
        this.performanceMonitor = new PerformanceMonitor(options, this.reporter);
        this.exceptionMonitor.watch();
        this.performanceMonitor.watch();
    }

}