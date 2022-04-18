import * as React from 'react';

import {
    Actions,
    AskerParameter,
    AskPicklistCaptionMenuItem,
    AskPicklistMenuItem,
    Xml,
} from './types';
import { updateNode } from './Util';

interface Props {
    actions: Actions;
    id: string[];
    parameter: AskerParameter;
    xml: Xml;
}

const hasCaption = (menuItem: AskPicklistMenuItem): menuItem is AskPicklistCaptionMenuItem => {
    return (menuItem as AskPicklistCaptionMenuItem).caption !== undefined;
};

export default class AskPicklist extends React.Component<Props> {
    public render(): React.ReactNode {
        const { parameter } = this.props;

        const menuItems = parameter.map((menuItem) => {
            let caption;
            let value: string;
            if (hasCaption(menuItem)) {
                caption = <span className="explainer">{ menuItem.caption }</span>;
                value = menuItem.value;
            } else {
                value = menuItem;
            }

            return (
                <div
                    className="menuItem focusme techno"
                    key={ value }
                    onClick={(e: React.MouseEvent) => {
                        this.onClick(value);
                        e.preventDefault();
                    }}
                >
                    <span className="punc">"</span>
                    { value }
                    <span className="punc">"</span>
                    { caption }
                </div>
            );
        });

        return (
            <div className="menu">
                { menuItems }
            </div>
        );
    }

    private onClick(value: string) {
        const { actions, id, xml } = this.props;
        actions.setXml(updateNode(xml, id, value));
        actions.showBubble({
            show: false,
        });
    }
}
