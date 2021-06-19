/**
 * Creates a mapper that maps components used during a server-side render
 * to async chunk files in the client-side build, so that we can inline them
 * directly in the rendered HTML to avoid waterfall requests.
 */
import { ClientManifest } from '.';
export declare type AsyncFileMapper = (files: string[]) => string[];
export declare function createMapper(clientManifest: ClientManifest): AsyncFileMapper;
