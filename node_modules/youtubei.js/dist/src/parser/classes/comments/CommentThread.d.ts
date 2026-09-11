import CommentView from './CommentView.js';
import CommentReplies from './CommentReplies.js';
import CommentsContinuation from '../misc/CommentsContinuation.js';
import { YTNode } from '../../helpers.js';
import type { RawNode } from '../../index.js';
import type Actions from '../../../core/Actions.js';
import type { ObservedArray } from '../../helpers.js';
export default class CommentThread extends YTNode {
    #private;
    static type: string;
    comment: CommentView | null;
    replies?: ObservedArray<CommentThread>;
    comment_replies_data: CommentReplies | null;
    is_moderated_elq_comment: boolean;
    has_replies: boolean;
    rendering_priority?: 'RENDERING_PRIORITY_UNKNOWN' | 'RENDERING_PRIORITY_PINNED_COMMENT' | 'RENDERING_PRIORITY_LINKED_COMMENT' | 'RENDERING_PRIORITY_REALTIME_COMMENT' | 'RENDERING_PRIORITY_COMMUNITY_GUIDELINES_BELOW_HEADER' | 'RENDERING_PRIORITY_FAN_COMMUNITY_SETUP_CARD' | 'RENDERING_PRIORITY_COMMENT_HEADER';
    constructor(data: RawNode);
    /**
     * Indicates whether this comment thread has more replies that can be fetched.
     */
    get has_continuation(): boolean;
    /**
     * Indicates whether this comment thread has prepopulated reply data. If false, you will need to call {@link CommentThread.getReplies} to fetch the initial batch of replies.
     */
    get is_prepopulated(): boolean;
    /**
     * Retrieves replies to this comment thread.
     */
    getReplies(): Promise<CommentThread>;
    /**
     * Retrieves next batch of replies.
     */
    getContinuation(): Promise<CommentsContinuation>;
    /**
     * @internal
     */
    setActions(actions: Actions): void;
    /**
     * @internal
     */
    processRepliesData(): void;
}
