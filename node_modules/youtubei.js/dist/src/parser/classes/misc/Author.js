import { observe } from '../../helpers.js';
import { Parser } from '../../index.js';
import Text from './Text.js';
import Thumbnail from './Thumbnail.js';
import ShowDialogCommand from '../commands/ShowDialogCommand.js';
import DialogView from '../DialogView.js';
import ListView from '../ListView.js';
import ListItemView from '../ListItemView.js';
export default class Author {
    id;
    name;
    thumbnails;
    endpoint;
    badges;
    avatar_thumbnail_url;
    is_current_user;
    is_public_subscriber;
    is_creator;
    is_moderator;
    is_verified;
    is_verified_artist;
    constructor(item, badges, thumbs, id) {
        let nav_text;
        if (item) {
            if ('content' in item) {
                nav_text = Text.fromAttributed(item);
            }
            else {
                nav_text = new Text(item);
            }
        }
        this.id = id || nav_text?.runs?.[0]?.endpoint?.payload?.browseId || nav_text?.endpoint?.payload?.browseId || badges?.channelId;
        this.name = nav_text?.text || 'N/A';
        this.thumbnails = thumbs ? Thumbnail.fromResponse(thumbs) : [];
        this.endpoint = nav_text?.runs?.[0]?.endpoint || nav_text?.endpoint;
        if (badges) {
            if (Array.isArray(badges)) {
                this.badges = Parser.parseArray(badges);
                this.is_moderator = this.badges?.some((badge) => badge.icon_type == 'MODERATOR');
                this.is_verified = this.badges?.some((badge) => badge.style == 'BADGE_STYLE_TYPE_VERIFIED');
                this.is_verified_artist = this.badges?.some((badge) => badge.style == 'BADGE_STYLE_TYPE_VERIFIED_ARTIST');
            }
            else {
                this.badges = observe([]);
                if ('avatarThumbnailUrl' in badges) {
                    this.avatar_thumbnail_url = badges.avatarThumbnailUrl;
                }
                if ('isCurrentUser' in badges) {
                    this.is_current_user = !!badges.isCurrentUser;
                }
                if ('isPublicSubscriber' in badges) {
                    this.is_public_subscriber = !!badges.isPublicSubscriber;
                }
                if ('isCreator' in badges) {
                    this.is_creator = !!badges.isCreator;
                }
                if ('isVerified' in badges) {
                    this.is_verified = !!badges.isVerified;
                }
                if ('isArtist' in badges) {
                    this.is_verified_artist = !!badges.isArtist;
                }
            }
        }
        else {
            this.badges = observe([]);
        }
    }
    get url() {
        return this.endpoint?.toURL();
    }
    get best_thumbnail() {
        return this.thumbnails[0];
    }
    get collaborators() {
        if (this.endpoint?.command?.is(ShowDialogCommand) && this.endpoint.command.inline_content?.is(DialogView)) {
            const dialog = this.endpoint.command.inline_content;
            if (dialog.custom_content?.is(ListView)) {
                return dialog.custom_content.items.as(ListItemView)
                    .filter((item) => item.renderer_context?.command_context?.on_tap?.metadata?.page_type === 'WEB_PAGE_TYPE_CHANNEL');
            }
        }
        return [];
    }
}
//# sourceMappingURL=Author.js.map