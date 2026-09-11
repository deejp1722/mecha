import { InnertubeError } from '../../../utils/Utils.js';
import { observe } from '../../helpers.js';
import AppendContinuationItemsAction from '../actions/AppendContinuationItemsAction.js';
import CommentThread from '../comments/CommentThread.js';
import ContinuationItem from '../ContinuationItem.js';
export default class CommentsContinuation {
    replies = observe([]);
    #actions;
    #nextContinuationItem;
    constructor(actions, data) {
        this.#actions = actions;
        if (!data.on_response_received_endpoints || !data.on_response_received_endpoints_memo) {
            throw new InnertubeError('Invalid response received for comments continuation', data);
        }
        const appendContinuationItemsNode = data.on_response_received_endpoints.firstOfType(AppendContinuationItemsAction);
        if (appendContinuationItemsNode) {
            for (const item of appendContinuationItemsNode.contents) {
                if (item.is(CommentThread)) {
                    item.setActions(this.#actions);
                    item.processRepliesData();
                    this.replies.push(item);
                }
                else if (item.is(ContinuationItem)) {
                    this.#nextContinuationItem = item;
                }
            }
        }
    }
    /**
     * Indicates whether this comment thread has more replies that can be fetched.
     */
    get has_continuation() {
        return !!this.#nextContinuationItem;
    }
    /**
     * Retrieves next batch of replies.
     */
    async getContinuation() {
        if (!this.#nextContinuationItem)
            throw new InnertubeError('No continuation item found');
        const loadMoreButton = this.#nextContinuationItem.button;
        if (!loadMoreButton)
            throw new InnertubeError('"Load more" button not found in continuation item');
        const response = await loadMoreButton.endpoint.call(this.#actions, { parse: true });
        return new CommentsContinuation(this.#actions, response);
    }
}
//# sourceMappingURL=CommentsContinuation.js.map