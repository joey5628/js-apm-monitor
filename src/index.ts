import { Options } from './core/types';
import Reporter from './core/reporter';
import ExceptionMonitor from './monitor/exception';

export default class ApmMonitor {
    
    private reporter: Reporter | null;
    private exceptionMonitor: ExceptionMonitor | null;

    constructor() {
        this.reporter = null;
        this.exceptionMonitor = null;
    }

    init(options: Options): void {
        this.reporter = new Reporter(options);
        this.exceptionMonitor = new ExceptionMonitor(options, this.reporter);
        this.exceptionMonitor.watch();
    }

}