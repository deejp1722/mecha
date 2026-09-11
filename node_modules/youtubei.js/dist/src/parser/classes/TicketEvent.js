import { YTNode } from '../helpers.js';
import NavigationEndpoint from './NavigationEndpoint.js';
export default class TicketEvent extends YTNode {
    static type = 'TicketEvent';
    title;
    time_month;
    time_day;
    link_text;
    button_text;
    endpoint;
    subtitle1;
    subtitle2;
    time_date;
    time_time;
    time_weekday;
    button_accessibility_text;
    has_multiple_offers;
    constructor(data) {
        super();
        this.title = data.title;
        this.time_month = data.timeMonth;
        this.time_day = data.timeDay;
        this.link_text = data.linkText;
        this.button_text = data.buttonText;
        this.endpoint = new NavigationEndpoint(data.buttonCommand);
        this.subtitle1 = data.subtitle1;
        this.subtitle2 = data.subtitle2;
        this.time_date = data.timeDate;
        this.time_time = data.timeTime;
        this.time_weekday = data.timeWeekday;
        this.button_accessibility_text = data.buttonAccessibilityText;
        this.has_multiple_offers = data.hasMultipleOffers;
    }
}
//# sourceMappingURL=TicketEvent.js.map