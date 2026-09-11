import { Context } from '../common.ts';
import { type Parser } from '../parser/parser.ts';
import { Token } from '../token.ts';
import { NumberKind } from './common.ts';
export declare function scanNumber(parser: Parser, context: Context, kind: NumberKind): Token;
