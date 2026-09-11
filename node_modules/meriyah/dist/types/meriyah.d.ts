import { type Program } from './estree.ts';
import { type Options } from './options.ts';
export declare const version: string;
export declare function parseScript(source: string, options?: Omit<Options, 'sourceType'>): Program;
export declare function parseModule(source: string, options?: Omit<Options, 'sourceType'>): Program;
export declare function parse(source: string, options?: Options): Program;
export { type Options } from './options.ts';
export type * as ESTree from './estree.ts';
export { isParseError, type ParseError } from './errors.ts';
