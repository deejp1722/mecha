import { type ObservedArray, YTNode } from '../helpers.js';
import type { RawNode } from '../types/index.js';
import Text from './misc/Text.js';
import AvatarView from './AvatarView.js';
import RendererContext from './misc/RendererContext.js';
export default class AvatarStackView extends YTNode {
    static type: string;
    avatars: ObservedArray<AvatarView>;
    text?: Text;
    avatar_cluster_size?: 'AVATAR_SIZE_UNKNOWN' | 'AVATAR_SIZE_XS' | 'AVATAR_SIZE_S' | 'AVATAR_SIZE_M' | 'AVATAR_SIZE_XL' | 'AVATAR_SIZE_40' | 'AVATAR_SIZE_L' | 'AVATAR_SIZE_XXS' | 'AVATAR_SIZE_RESPONSIVE' | 'AVATAR_SIZE_XXL' | 'AVATAR_SIZE_XXXL' | 'AVATAR_SIZE_48';
    layout_type?: 'AVATAR_STACK_LAYOUT_CLUSTER';
    renderer_context: RendererContext;
    constructor(data: RawNode);
}
