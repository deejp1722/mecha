import { YTNode } from '../helpers.js';
import { Parser } from '../index.js';
import { RendererContext, Text, Thumbnail } from '../misc.js';
export default class ContentListItemView extends YTNode {
    static type = 'ContentListItemView';
    title;
    action_button;
    avatar;
    image;
    metadata;
    renderer_context;
    constructor(data) {
        super();
        this.title = Text.fromAttributed(data.title);
        this.action_button = Parser.parseItem(data.actionButton);
        this.avatar = Parser.parseItem(data.avatar);
        this.image = Thumbnail.fromResponse(data.image);
        this.metadata = Parser.parseItem(data.metadata);
        if ('rendererContext' in data) {
            this.renderer_context = new RendererContext(data.rendererContext);
        }
    }
}
//# sourceMappingURL=ContentListItemView.js.map