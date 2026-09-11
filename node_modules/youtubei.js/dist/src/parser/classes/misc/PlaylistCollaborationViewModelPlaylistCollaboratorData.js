import { Parser } from '../../index.js';
export default class PlaylistCollaborationViewModelPlaylistCollaboratorData {
    remove_collaborator_confirmation_dialog;
    external_channel_id;
    collaborator_content_list_item;
    constructor(data) {
        this.remove_collaborator_confirmation_dialog = Parser.parseItem(data.removeCollaboratorConfirmationDialog);
        this.external_channel_id = data.externalChannelId;
        this.collaborator_content_list_item = Parser.parseItem(data.collaboratorContentListItem);
    }
}
//# sourceMappingURL=PlaylistCollaborationViewModelPlaylistCollaboratorData.js.map