import type { RawNode } from '../index.js';
import { YTNode } from '../helpers.js';
import AvatarStackView from './AvatarStackView.js';
export default class ThumbnailOverlayAvatarStackView extends YTNode {
    static type: string;
    avatar_stack: AvatarStackView | null;
    constructor(data: RawNode);
}
