import { Parser } from '../index.js';
import { YTNode } from '../helpers.js';
import AvatarStackView from './AvatarStackView.js';
export default class ThumbnailOverlayAvatarStackView extends YTNode {
    static type = 'ThumbnailOverlayAvatarStackView';
    avatar_stack;
    constructor(data) {
        super();
        this.avatar_stack = Parser.parseItem(data.avatarStack, AvatarStackView);
    }
}
//# sourceMappingURL=ThumbnailOverlayAvatarStackView.js.map