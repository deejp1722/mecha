import { YTNode } from '../helpers.js';
import { type RawNode } from '../index.js';
import { RendererContext, Text, Thumbnail } from '../misc.js';
export default class ContentListItemView extends YTNode {
    static type: string;
    title: Text;
    action_button: YTNode | null;
    avatar: YTNode | null;
    image: Thumbnail[];
    metadata: YTNode | null;
    renderer_context?: RendererContext;
    constructor(data: RawNode);
}
