import { YTNode } from '../helpers.js';
import type { RawNode } from '../index.js';
import NavigationEndpoint from './NavigationEndpoint.js';
export default class TicketEvent extends YTNode {
    static type: string;
    title: string;
    time_month: string;
    time_day: string;
    link_text: string;
    button_text: string;
    endpoint: NavigationEndpoint;
    subtitle1: string;
    subtitle2: string;
    time_date: string;
    time_time: string;
    time_weekday: string;
    button_accessibility_text: string;
    has_multiple_offers: boolean;
    constructor(data: RawNode);
}
