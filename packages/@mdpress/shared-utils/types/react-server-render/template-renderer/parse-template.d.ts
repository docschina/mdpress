export interface ParsedTemplate {
    head: (data: any) => string;
    neck: (data: any) => string;
    tail: (data: any) => string;
}
export declare function parseTemplate(template: string, contentPlaceholder?: string): ParsedTemplate;
