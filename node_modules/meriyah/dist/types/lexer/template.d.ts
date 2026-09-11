import { Context } from '../common.ts';
import { type Parser } from '../parser/parser.ts';
import { Token } from '../token.ts';
export declare function scanTemplate(parser: Parser, context: Context): Token;
export declare function scanTemplateTail(parser: Parser, context: Context): Token;
