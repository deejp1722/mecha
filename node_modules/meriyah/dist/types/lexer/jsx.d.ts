import { type Context } from '../common.ts';
import { type Parser } from '../parser/parser.ts';
import { Token } from '../token.ts';
export declare function scanJSXAttributeValue(parser: Parser, context: Context): Token;
export declare function nextJSXToken(parser: Parser): void;
export declare function rescanJSXIdentifier(parser: Parser): Token;
