import { YTNode } from '../../helpers.js';
const API_PATH = 'get_panel';
export default class ShowEngagementPanelEndpoint extends YTNode {
    static type = 'ShowEngagementPanelEndpoint';
    #data;
    panel_identifier;
    source_panel_identifier;
    constructor(data) {
        super();
        this.#data = data;
        this.panel_identifier = data.panelIdentifier;
        this.source_panel_identifier = data.sourcePanelIdentifier;
    }
    getApiPath() {
        return API_PATH;
    }
    buildRequest() {
        const request = {};
        const panelId = this.#data.panelIdentifier || this.#data.identifier?.tag;
        if (panelId)
            request.panelId = panelId;
        if (this.#data.globalConfiguration?.params)
            request.params = this.#data.globalConfiguration?.params;
        return request;
    }
}
//# sourceMappingURL=ShowEngagementPanelEndpoint.js.map