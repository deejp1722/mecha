import { type ObservedArray } from '../../helpers.js';
import CommentThread from '../comments/CommentThread.js';
import type { Actions } from '../../../core/index.js';
import type { INextResponse } from '../../types/index.js';
export default class CommentsContinuation {
    #private;
    replies: ObservedArray<CommentThread>;
    constructor(actions: Actions, data: INextResponse);
    /**
     * Indicates whether this comment thread has more replies that can be fetched.
     */
    get has_continuation(): boolean;
    /**
     * Retrieves next batch of replies.
     */
    getContinuation(): Promise<CommentsContinuation>;
}
