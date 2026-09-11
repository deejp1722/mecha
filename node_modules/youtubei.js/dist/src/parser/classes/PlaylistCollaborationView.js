import { YTNode } from '../helpers.js';
import { Parser } from '../index.js';
import ContentListItemView from './ContentListItemView.js';
import PlaylistCollaborationFormSchema from './misc/PlaylistCollaborationFormSchema.js';
import PlaylistCollaborationViewModelPlaylistCollaboratorData from './misc/PlaylistCollaborationViewModelPlaylistCollaboratorData.js';
export default class PlaylistCollaborationView extends YTNode {
    static type = 'PlaylistCollaborationView';
    playlist_collaborators;
    turn_off_collaboration_dialog;
    copy_link_button;
    collaborate_playlist_collaboration_setting;
    playlist_collaboration_entity_key;
    playlist_collaborators_data;
    leave_collaborative_playlist_confirmation_dialog;
    collaboration_type;
    allow_new_collaborators_playlist_collaboration_setting;
    playlist_collaboration_form_schema;
    turn_off_allow_new_collaborators_dialog;
    invite_collaborators_button;
    constructor(data) {
        super();
        this.playlist_collaborators = Parser.parseArray(data.playlistCollaborators, ContentListItemView);
        this.turn_off_collaboration_dialog = Parser.parseItem(data.turnOffCollaborationDialog);
        this.copy_link_button = Parser.parseItem(data.copyLinkButton);
        this.collaborate_playlist_collaboration_setting = Parser.parseItem(data.collaboratePlaylistCollaborationSetting);
        if ('playlistCollaboratorsData' in data) {
            this.playlist_collaborators_data = data.playlistCollaboratorsData.map((item) => new PlaylistCollaborationViewModelPlaylistCollaboratorData(item));
        }
        if ('playlistCollaborationFormSchema' in data) {
            this.playlist_collaboration_form_schema = new PlaylistCollaborationFormSchema(data.playlistCollaborationFormSchema);
        }
        this.leave_collaborative_playlist_confirmation_dialog = Parser.parseItem(data.leaveCollaborativePlaylistConfirmationDialog);
        this.allow_new_collaborators_playlist_collaboration_setting = Parser.parseItem(data.allowNewCollaboratorsPlaylistCollaborationSetting);
        this.turn_off_allow_new_collaborators_dialog = Parser.parseItem(data.turnOffAllowNewCollaboratorsDialog);
        this.invite_collaborators_button = Parser.parseItem(data.inviteCollaboratorsButton);
        this.playlist_collaboration_entity_key = data.playlistCollaborationEntityKey;
        this.collaboration_type = data.collaborationType;
    }
}
//# sourceMappingURL=PlaylistCollaborationView.js.map