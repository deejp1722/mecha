import { YTNode } from '../helpers.js';
import { Parser } from '../index.js';
import Text from './misc/Text.js';
import AvatarView from './AvatarView.js';
import RendererContext from './misc/RendererContext.js';
export default class AvatarStackView extends YTNode {
    static type = 'AvatarStackView';
    avatars;
    text;
    avatar_cluster_size;
    layout_type;
    renderer_context;
    constructor(data) {
        super();
        this.avatars = Parser.parseArray(data.avatars, AvatarView);
        if ('text' in data) {
            this.text = Text.fromAttributed(data.text);
        }
        if ('avatarClusterSize' in data) {
            this.avatar_cluster_size = data.avatarClusterSize;
        }
        if ('layoutType' in data) {
            this.layout_type = data.layoutType;
        }
        this.renderer_context = new RendererContext(data.rendererContext);
    }
}
//# sourceMappingURL=AvatarStackView.js.map