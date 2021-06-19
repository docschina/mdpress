import { SourceMapConsumer } from 'source-map';
export declare function createSourceMapConsumers(rawMaps: object): {};
export declare function rewriteErrorTrace(e: any, mapConsumers: {
    [key: string]: SourceMapConsumer;
}): void;
