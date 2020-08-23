import * as React from 'react';

import { BubbleType, Actions, DocSpec, MenuItemSpec, MenuItemSpecNoParameter, Xml } from './types';
import { askLongString, getXmlNode, hasActionParameter, updateNode } from './Util';

interface Props {
    actions: Actions;
    attribute: string;
    docSpec: DocSpec;
    element: string;
    id: string[];
    left: number;
    show: boolean;
    top: number;
    type: BubbleType;
    value: string;
    xml: Xml;
}

export default class Bubble extends React.Component<Props> {
    public constructor(props: Props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.showMenuItem = this.showMenuItem.bind(this);
    }

    public render(): React.ReactNode {
        const {
            id,
            show,
        } = this.props;
        if (!show) {
            return null;
        }
        if (id.length > 2 && id[id.length - 2] === '$') {
            return this.getAttributeBubble();
        } else if (id.length > 2 && id[id.length - 2] === '$$') {
            return this.getElementBubble();
        } else if (id.length > 1 && id[id.length - 1] === '_') {
            return this.getTextBubble();
        }
        return null;
    }

    private getTextBubble(): React.ReactNode {
        const { actions, id, left, top, value, xml } = this.props;
        return (
            <div className="nerd" id="xonomyBubble" style={{ left, top, display: 'block' }}>
                <div className="inside">
                    <div id="xonomyBubbleContent">
                        { askLongString({
                            actions,
                            defaultValue: value,
                            id,
                            xml,
                        }) }
                    </div>
                </div>
            </div>
        );
    }

    private getElementBubble(): React.ReactNode {
        const { actions, docSpec, element, id, left, top, xml } = this.props;

        const menu = docSpec.elements?.[element]?.menu;
        if (menu) {
            const menuItems = menu.filter(this.showMenuItem).map((menuItemSpec, index) => (
                <div
                    className="menuItem focusme"
                    key={ index }
                    onClick={ async () => {
                        if (hasActionParameter(menuItemSpec)) {
                            actions.setXml(await menuItemSpec.action(xml, id, menuItemSpec.actionParameter));
                        } else {
                            actions.setXml(await (menuItemSpec as MenuItemSpecNoParameter).action(xml, id));
                        }
                        actions.showBubble({ show: false });
                    } }
                >
                    { menuItemSpec.caption }
                </div>
            ));

            return (
                <div className="nerd" id="xonomyBubble" style={{ left, top, display: 'block' }}>
                    <div className="inside">
                        <div id="xonomyBubbleContent">
                            <div className="menu">
                                {menuItems}
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    }

    private getAttributeBubble(): React.ReactNode {
        const { type } = this.props;
        if (type === BubbleType.ASKER) {
            return this.getAttributeAskerBubble();
        }
        return this.getAttributeMenuBubble();
    }

    private getAttributeMenuBubble(): React.ReactNode {
        const { actions, attribute, docSpec, element, id, left, top, xml } = this.props;
        const menu = docSpec.elements?.[element].attributes?.[attribute].menu;
        if (menu) {
            const menuItems = menu.filter(this.showMenuItem).map((menuItemSpec, index) => (
                <div
                    className="menuItem focusme"
                    key={ index }
                    onClick={ async () => {
                        if (hasActionParameter(menuItemSpec)) {
                            actions.setXml(await menuItemSpec.action(xml, id, menuItemSpec.actionParameter));
                        } else {
                            actions.setXml(await (menuItemSpec as MenuItemSpecNoParameter).action(xml, id));
                        }
                        actions.showBubble({ show: false });
                    } }
                >
                    { menuItemSpec.caption }
                </div>
            ));

            return (
                <div className="nerd" id="xonomyBubble" style={{ left, top, display: 'block' }}>
                    <div className="inside">
                        <div id="xonomyBubbleContent">
                            <div className="menu">
                                {menuItems}
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    }

    private getAttributeAskerBubble(): React.ReactNode {
        const { actions, attribute, docSpec, element, id, left, top, value, xml } = this.props;
        const attributeSpec = docSpec.elements?.[element].attributes?.[attribute];
        if (attributeSpec && attributeSpec.asker) {
            const asker = attributeSpec.asker;
            const parameter = attributeSpec.askerParameter;
            return (
                <div className="nerd" id="xonomyBubble" style={{ left, top, display: 'block' }}>
                    <div className="inside">
                        <div id="xonomyBubbleContent">
                        { asker({
                            actions,
                            defaultValue: value,
                            id,
                            parameter,
                            xml,
                        }) }
                        </div>
                    </div>
                </div>
            );
        }
    }

    private onSubmit(event: React.FormEvent<HTMLFormElement>): void {
        const { actions, id, value, xml } = this.props;
        actions.setXml(updateNode(xml, id, value));
        actions.showBubble({
            show: false,
        });
        event.preventDefault();
    }

    private onChange(event: React.FormEvent<HTMLInputElement>): void {
        const { actions } = this.props;
        actions.showBubble({
            value: (event.target as HTMLInputElement).value,
        });
    }

    private showMenuItem(menuItemSpec: MenuItemSpec): boolean {
        const { id, xml } = this.props;
        if (menuItemSpec.hideIf) {
            return !menuItemSpec.hideIf(getXmlNode(id, xml));
        }
        return true;
    }
}
