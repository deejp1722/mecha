import type { YTNode } from '../../helpers.js';
import { type RawNode } from '../../index.js';
export default class PlaylistCollaborationViewModelPlaylistCollaboratorData {
    remove_collaborator_confirmation_dialog: YTNode | null;
    external_channel_id?: string;
    collaborator_content_list_item: YTNode | null;
    constructor(data: RawNode);
}
