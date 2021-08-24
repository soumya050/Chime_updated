import { Logger } from '../../libs/voicefocus/types';
import SDKLogger from '../logger/Logger';
/** @internal */
export default class LoggerAdapter implements Logger {
    private base;
    constructor(base: SDKLogger);
    debug(...args: unknown[]): void;
    info(...args: unknown[]): void;
    warn(...args: unknown[]): void;
    error(...args: unknown[]): void;
}
