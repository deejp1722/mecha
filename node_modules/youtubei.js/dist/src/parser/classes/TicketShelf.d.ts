import type { RawNode } from '../index.js';
import type { ObservedArray } from '../helpers.js';
import { YTNode } from '../helpers.js';
import TicketEvent from './TicketEvent.js';
export default class TicketShelf extends YTNode {
    static type: string;
    title: string;
    events: ObservedArray<TicketEvent>;
    information_text: string;
    use_calendar_avatar: boolean;
    constructor(data: RawNode);
}
