import type * as ESTree from './estree.ts';
import { type Token } from './token.ts';
type OnInsertedSemicolon = (pos: number) => any;
type SourceType = 'script' | 'module' | 'commonjs';
export type OnToken = (token: string, start: number, end: number, loc: ESTree.SourceLocation) => any;
export type OnComment = (type: ESTree.CommentType, value: string, start: number, end: number, loc: ESTree.SourceLocation) => any;
export interface Options {
    sourceType?: SourceType;
    next?: boolean;
    ranges?: boolean | {
        start?: boolean;
        end?: boolean;
        range?: boolean;
    };
    webcompat?: boolean;
    loc?: boolean;
    raw?: boolean;
    impliedStrict?: boolean;
    preserveParens?: boolean;
    lexical?: boolean;
    source?: string;
    jsx?: boolean;
    onComment?: ESTree.Comment[] | OnComment;
    onInsertedSemicolon?: OnInsertedSemicolon;
    onToken?: Token[] | OnToken;
    validateRegex?: boolean;
    module?: boolean;
    globalReturn?: boolean;
}
interface NormalizedRanges {
    start: boolean;
    end: boolean;
    range: boolean;
}
export type InternalOptions = Options & {
    features?: number;
};
export type NormalizedOptions = Omit<Options, 'validateRegex' | 'onComment' | 'onToken' | 'ranges' | 'next' | 'module' | 'globalReturn'> & {
    validateRegex: boolean;
    ranges?: NormalizedRanges;
    onComment?: OnComment;
    onToken?: OnToken;
    features: number;
};
export declare function normalizeOptions(rawOptions: InternalOptions): NormalizedOptions;
export {};
