import { Context } from '../common.ts';
import { type Parser } from '../parser/parser.ts';
import { Token } from '../token.ts';
import { LexerState } from './common.ts';
export declare function nextToken(parser: Parser, context: Context): void;
export declare function scanSingleToken(parser: Parser, context: Context, state: LexerState): Token;
