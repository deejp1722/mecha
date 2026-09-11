import { type Location, PropertyKind } from '../common.ts';
import { type Parser } from './parser.ts';
export declare class PrivateScope {
    readonly parser: Parser;
    readonly parent?: PrivateScope | undefined;
    refs: {
        [name: string]: Location[];
    };
    privateIdentifiers: Map<string, PropertyKind>;
    constructor(parser: Parser, parent?: PrivateScope | undefined);
    addPrivateIdentifier(name: string, kind: PropertyKind): void;
    addPrivateIdentifierRef(name: string): void;
    isPrivateIdentifierDefined(name: string): boolean;
    validatePrivateIdentifierRefs(): void;
    hasPrivateIdentifier(name: string): boolean;
}
