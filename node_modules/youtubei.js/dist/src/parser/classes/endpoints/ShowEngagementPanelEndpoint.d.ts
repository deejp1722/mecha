import { YTNode } from '../../helpers.js';
import type { ShowEngagementPanelRequest, IEndpoint, RawNode } from '../../index.js';
export default class ShowEngagementPanelEndpoint extends YTNode implements IEndpoint<ShowEngagementPanelRequest> {
    #private;
    static type: string;
    panel_identifier: string;
    source_panel_identifier?: string;
    constructor(data: RawNode);
    getApiPath(): string;
    buildRequest(): ShowEngagementPanelRequest;
}
