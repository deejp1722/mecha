import { Context } from './common.ts';
import type * as ESTree from './estree.ts';
import { type InternalOptions } from './options.ts';
export declare function parseSource(source: string, rawOptions?: InternalOptions, context?: Context): ESTree.Program;
