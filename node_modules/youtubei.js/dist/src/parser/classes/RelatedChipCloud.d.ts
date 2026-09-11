import { type RawNode } from '../index.js';
import { YTNode } from '../helpers.js';
export default class RelatedChipCloud extends YTNode {
    static type: string;
    content: YTNode;
    show_prominent_chips: boolean;
    constructor(data: RawNode);
}
