import { type ObservedArray, YTNode } from '../helpers.js';
import { type RawNode } from '../index.js';
import ContentListItemView from './ContentListItemView.js';
import PlaylistCollaborationFormSchema from './misc/PlaylistCollaborationFormSchema.js';
import PlaylistCollaborationViewModelPlaylistCollaboratorData from './misc/PlaylistCollaborationViewModelPlaylistCollaboratorData.js';
export default class PlaylistCollaborationView extends YTNode {
    static type: string;
    playlist_collaborators?: ObservedArray<ContentListItemView>;
    turn_off_collaboration_dialog: YTNode | null;
    copy_link_button: YTNode | null;
    collaborate_playlist_collaboration_setting: YTNode | null;
    playlist_collaboration_entity_key?: string;
    playlist_collaborators_data?: PlaylistCollaborationViewModelPlaylistCollaboratorData[];
    leave_collaborative_playlist_confirmation_dialog: YTNode | null;
    collaboration_type?: 'COLLABORATION_TYPE_UNSPECIFIED' | 'COLLABORATION_TYPE_DEFAULT' | 'COLLABORATION_TYPE_TASTE_MATCH';
    allow_new_collaborators_playlist_collaboration_setting: YTNode | null;
    playlist_collaboration_form_schema?: PlaylistCollaborationFormSchema;
    turn_off_allow_new_collaborators_dialog: YTNode | null;
    invite_collaborators_button: YTNode | null;
    constructor(data: RawNode);
}
