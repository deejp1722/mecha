import { YTNode } from '../helpers.js';
import { Parser } from '../index.js';
import Text from './misc/Text.js';
import ButtonView from './ButtonView.js';
export default class VideoDescriptionYouchatSectionView extends YTNode {
    static type = 'VideoDescriptionYouchatSectionView';
    section_title;
    sub_header_text;
    primary_button;
    constructor(data) {
        super();
        if ('sectionTitle' in data) {
            this.section_title = Text.fromAttributed(data.sectionTitle);
        }
        if ('subHeaderText' in data) {
            this.sub_header_text = Text.fromAttributed(data.subHeaderText);
        }
        this.primary_button = Parser.parseItem(data.primaryButton, ButtonView);
    }
}
//# sourceMappingURL=VideoDescriptionYouchatSectionView.js.map