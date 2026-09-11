export default class PlaylistCollaborationFormSchema {
    id;
    initial_values;
    constructor(data) {
        this.id = data.id;
        if ('initialValues' in data) {
            this.initial_values = {
                collaborator_channel_ids: data.initialValues?.collaboratorChannelIds,
                is_allow_new_collaborators_enabled: data.initialValues?.isAllowNewCollaboratorsEnabled,
                is_collaboration_enabled: data.initialValues?.isCollaborationEnabled,
                is_invite_collaborators_button_enabled: data.initialValues?.isInviteCollaboratorsButtonEnabled
            };
        }
    }
}
//# sourceMappingURL=PlaylistCollaborationFormSchema.js.map