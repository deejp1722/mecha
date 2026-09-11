import { YTNode } from '../helpers.js';
import { type RawNode } from '../index.js';
import Text from './misc/Text.js';
import ButtonView from './ButtonView.js';
export default class VideoDescriptionYouchatSectionView extends YTNode {
    static type: string;
    section_title?: Text;
    sub_header_text?: Text;
    primary_button: ButtonView | null;
    constructor(data: RawNode);
}
