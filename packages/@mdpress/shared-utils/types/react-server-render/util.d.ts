export declare const isJS: (file: string) => boolean;
export declare const isCSS: (file: string) => boolean;
export declare function createPromiseCallback(): {
    promise: Promise<string>;
    cb: (err: Error, res?: string | undefined) => any;
};
export interface UserContext {
    asyncContext?: any;
    head?: string;
    styles?: string;
    getPreloadFiles?: any;
    url?: string;
    _styles?: any;
    _mappedFiles?: any;
    _registeredComponents?: Set<any>;
    [key: string]: any;
}
