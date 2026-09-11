import type { RawNode } from '../../types/RawResponse.js';
type PlaylistCollaborationFormData = {
    collaborator_channel_ids?: string[] | undefined;
    is_allow_new_collaborators_enabled?: boolean | undefined;
    is_collaboration_enabled?: boolean | undefined;
    is_invite_collaborators_button_enabled?: boolean | undefined;
};
export default class PlaylistCollaborationFormSchema {
    id: string;
    initial_values?: PlaylistCollaborationFormData;
    constructor(data: RawNode);
}
export {};
