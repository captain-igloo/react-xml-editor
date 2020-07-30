import * as React from 'react';

import { EBubbleType, IActions, IDocSpec, IMenuItemSpec, IXml } from './types';
import { askLongString, updateNode } from './Util';

interface IProps {
    actions: IActions;
    attribute: string;
    docSpec: IDocSpec;
    element: string;
    id: string;
    left: number;
    show: boolean;
    top: number;
    type: EBubbleType;
    value: string;
    xml: IXml;
}

export default class Bubble extends React.Component<IProps> {
    public constructor(props: IProps) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    public render(): React.ReactNode {
        const {
            id,
            show,
        } = this.props;
        if (!show) {
            return null;
        }

        if (id.match(/~\$~[^~]+$/)) {
            return this.getAttributeBubble();
        } else if (id.match(/~\$\$~[0-9]+$/)) {
            return this.getElementBubble();
        } else if (id.match(/~_$/)) {
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

        if (docSpec.elements && docSpec.elements[element] && docSpec.elements[element].menu) {
            const menu = docSpec.elements[element].menu;
            const menuItems = (menu as IMenuItemSpec[]).map((menuItemSpec, index) => (
                <div
                    className="menuItem focusme"
                    key={ index }
                    onClick={ async () => {
                        actions.setXml(await menuItemSpec.action(xml, id, menuItemSpec.actionParameter));
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
        const {
            actions,
            attribute,
            docSpec,
            id,
            element,
            left,
            top,
            type,
            value,
            xml,
        } = this.props;
        if (type === EBubbleType.ASKER) {
            if (docSpec.elements &&
                docSpec.elements[element] &&
                docSpec.elements[element].attributes &&
                docSpec.elements[element].attributes[attribute] &&
                docSpec.elements[element].attributes[attribute].asker) {
                return (
                    <div className="nerd" id="xonomyBubble" style={{ left, top, display: 'block' }}>
                        <div className="inside">
                            <div id="xonomyBubbleContent">
                            { (docSpec.elements[element].attributes[attribute].asker as any)({
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
        } else if (type === EBubbleType.MENU) {
            if (docSpec.elements &&
                docSpec.elements[element] &&
                docSpec.elements[element].attributes &&
                docSpec.elements[element].attributes[attribute] &&
                docSpec.elements[element].attributes[attribute].menu) {
                    const menu = docSpec.elements[element].attributes[attribute].menu;
                    const menuItems = (menu as IMenuItemSpec[]).map((menuItemSpec, index) => (
                        <div
                            className="menuItem focusme"
                            key={ index }
                            onClick={ async () => {
                                // setXml(menuItemSpec.action(xml, menuItemSpec.actionParameter));
                                actions.setXml(await menuItemSpec.action(xml, id, menuItemSpec.actionParameter));
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
        return null;
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
}
