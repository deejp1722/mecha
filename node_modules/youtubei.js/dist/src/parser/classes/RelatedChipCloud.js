import { Parser } from '../index.js';
import { YTNode } from '../helpers.js';
export default class RelatedChipCloud extends YTNode {
    static type = 'RelatedChipCloud';
    content;
    show_prominent_chips;
    constructor(data) {
        super();
        this.content = Parser.parseItem(data.content);
        this.show_prominent_chips = Boolean(data.showProminentChips);
    }
}
//# sourceMappingURL=RelatedChipCloud.js.map