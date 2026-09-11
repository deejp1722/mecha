import Button from '../Button.js';
import Thumbnail from '../misc/Thumbnail.js';
import CommentView from './CommentView.js';
import CommentThread from './CommentThread.js';
import ContinuationItem from '../ContinuationItem.js';
import { YTNode, type ObservedArray } from '../../helpers.js';
import type { RawNode } from '../../index.js';
export default class CommentReplies extends YTNode {
    static type: string;
    contents: ObservedArray<CommentView | ContinuationItem>;
    sub_threads: ObservedArray<CommentThread | ContinuationItem>;
    view_replies: Button | null;
    hide_replies: Button | null;
    view_replies_creator_thumbnail: Thumbnail[];
    has_channel_owner_replied: boolean;
    constructor(data: RawNode);
}
