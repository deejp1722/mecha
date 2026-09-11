import { Parser } from '../../index.js';
import Button from '../Button.js';
import Thumbnail from '../misc/Thumbnail.js';
import CommentView from './CommentView.js';
import CommentThread from './CommentThread.js';
import ContinuationItem from '../ContinuationItem.js';
import { YTNode } from '../../helpers.js';
export default class CommentReplies extends YTNode {
    static type = 'CommentReplies';
    contents;
    sub_threads;
    view_replies;
    hide_replies;
    view_replies_creator_thumbnail;
    has_channel_owner_replied;
    constructor(data) {
        super();
        this.contents = Parser.parseArray(data.contents, [CommentView, ContinuationItem]);
        this.sub_threads = Parser.parseArray(data.subThreads, [CommentThread, ContinuationItem]);
        this.view_replies = Parser.parseItem(data.viewReplies, Button);
        this.hide_replies = Parser.parseItem(data.hideReplies, Button);
        this.view_replies_creator_thumbnail = Thumbnail.fromResponse(data.viewRepliesCreatorThumbnail);
        this.has_channel_owner_replied = !!data.viewRepliesCreatorThumbnail;
    }
}
//# sourceMappingURL=CommentReplies.js.map