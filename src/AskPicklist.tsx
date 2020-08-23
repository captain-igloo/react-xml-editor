import * as React from 'react';

import { Actions, Xml } from './types';
import { updateNode } from './Util';

interface Props {
    actions: Actions;
    id: string[];
    parameter: any;
    xml: Xml;
}

export default class AskPicklist extends React.Component<Props> {

    public render(): React.ReactNode {
        const { parameter } = this.props;

        const menuItems = parameter.map((menuItem: any) => {
            return (
                <div
                    className="menuItem focusme techno"
                    key={ menuItem.value }
                    onClick={(e: React.MouseEvent) => {
                        this.onClick(menuItem.value);
                        e.preventDefault();
                    }}
                >
                    <span className="punc">"</span>
                    { menuItem.value }
                    <span className="punc">"</span>
                    <span className="explainer">{ menuItem.caption }</span>
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
