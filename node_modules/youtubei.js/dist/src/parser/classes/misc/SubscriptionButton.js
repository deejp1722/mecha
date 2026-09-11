import Text from './Text.js';
export default class SubscriptionButton {
    static type = 'SubscriptionButton';
    text;
    subscribed;
    subscription_type;
    constructor(data) {
        if ('text' in data) {
            this.text = new Text(data.text);
        }
        if ('subscribed' in data) {
            this.subscribed = data.subscribed;
        }
        if ('type' in data) {
            this.subscription_type = data.type;
        }
    }
}
//# sourceMappingURL=SubscriptionButton.js.map