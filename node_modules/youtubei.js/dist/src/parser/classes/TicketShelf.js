import { Parser } from '../index.js';
import { YTNode } from '../helpers.js';
import TicketEvent from './TicketEvent.js';
export default class TicketShelf extends YTNode {
    static type = 'TicketShelf';
    title;
    events;
    information_text;
    use_calendar_avatar;
    constructor(data) {
        super();
        this.title = data.title;
        this.events = Parser.parseArray(data.events, TicketEvent);
        this.information_text = data.informationText;
        this.use_calendar_avatar = data.useCalendarAvatar;
    }
}
//# sourceMappingURL=TicketShelf.js.map