import type NavigationEndpoint from '../NavigationEndpoint.js';
import { type ObservedArray, type YTNode } from '../../helpers.js';
import { type RawNode } from '../../index.js';
import Thumbnail from './Thumbnail.js';
import ListItemView from '../ListItemView.js';
export default class Author {
    id: string;
    name: string;
    thumbnails: Thumbnail[];
    endpoint?: NavigationEndpoint;
    badges: ObservedArray<YTNode>;
    avatar_thumbnail_url?: string;
    is_current_user?: boolean;
    is_public_subscriber?: boolean;
    is_creator?: boolean;
    is_moderator?: boolean;
    is_verified?: boolean;
    is_verified_artist?: boolean;
    constructor(item: RawNode, badges?: any, thumbs?: any, id?: string);
    get url(): string | undefined;
    get best_thumbnail(): Thumbnail | undefined;
    get collaborators(): ListItemView[];
}
