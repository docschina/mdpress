/// <reference types="node" />
import { Transform } from 'stream';
import { UserContext } from '../util';
import { ParsedTemplate } from './parse-template';
import TemplateRenderer from '.';
export default class TemplateStream extends Transform {
    started: boolean;
    renderer: TemplateRenderer;
    template: ParsedTemplate;
    context: UserContext;
    inject: boolean;
    constructor(renderer: TemplateRenderer, template: ParsedTemplate, context: UserContext);
    _transform(data: Buffer | string, _encoding: string, done: () => void): void;
    start(): void;
    _flush(done: () => void): void;
}
