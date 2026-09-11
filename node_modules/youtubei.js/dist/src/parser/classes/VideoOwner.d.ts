import Text from './misc/Text.js';
import Author from './misc/Author.js';
import { YTNode } from '../helpers.js';
import { type RawNode } from '../index.js';
import SubscriptionButton from './misc/SubscriptionButton.js';
import AvatarStackView from './AvatarStackView.js';
import NavigationEndpoint from './NavigationEndpoint.js';
export default class VideoOwner extends YTNode {
    static type: string;
    title?: Text;
    attributed_title?: Text;
    subscription_button?: SubscriptionButton;
    subscriber_count: Text;
    avatar_stack: AvatarStackView | null;
    endpoint?: NavigationEndpoint;
    author: Author;
    constructor(data: RawNode);
}
