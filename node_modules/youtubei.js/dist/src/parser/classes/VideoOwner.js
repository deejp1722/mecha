import Text from './misc/Text.js';
import Author from './misc/Author.js';
import { YTNode } from '../helpers.js';
import { Parser } from '../index.js';
import SubscriptionButton from './misc/SubscriptionButton.js';
import AvatarStackView from './AvatarStackView.js';
import NavigationEndpoint from './NavigationEndpoint.js';
export default class VideoOwner extends YTNode {
    static type = 'VideoOwner';
    title;
    attributed_title;
    subscription_button;
    subscriber_count;
    avatar_stack;
    endpoint;
    author;
    constructor(data) {
        super();
        if ('title' in data) {
            this.title = new Text(data.title);
        }
        if ('attributedTitle' in data) {
            this.attributed_title = Text.fromAttributed(data.attributedTitle);
        }
        if ('subscriptionButton' in data) {
            this.subscription_button = new SubscriptionButton(data.subscriptionButton);
        }
        if ('navigationEndpoint' in data) {
            this.endpoint = new NavigationEndpoint(data.navigationEndpoint);
        }
        this.avatar_stack = Parser.parseItem(data.avatarStack, AvatarStackView);
        this.subscriber_count = new Text(data.subscriberCountText);
        this.author = new Author({
            ...(data.title || data.attributedTitle),
            navigationEndpoint: data.navigationEndpoint
        }, data.badges, data.thumbnail);
    }
}
//# sourceMappingURL=VideoOwner.js.map