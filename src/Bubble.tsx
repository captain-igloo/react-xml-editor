import * as React from 'react';

import { BubbleType, Actions, DocSpec, MenuItemSpec, Xml } from './types';
import { askLongString } from './Util';

interface Props {
    actions: Actions;
    attribute: string;
    docSpec: DocSpec;
    element: string;
    id: string[];
    left: number;
    mode: 'laic' | 'nerd';
    show: boolean;
    top: number;
    type: BubbleType;
    value: string;
    xml: Xml;
}

const formatCaption = (caption: string) => {
    let key = 1;
    return caption.split(/((?:<\/?[^>]+\/?>)|(?:@[^ =]+(?:="[^"]*")?))/).map((piece) => {
        const elementMatches = piece.match(/<(\/?)([^>\/]+)(\/?)>/);
        const attrMatches = piece.match(/@(?:([^ ="]+))?=?(?:"([^"]*)")?/);
        if (elementMatches) {
            return (
                <span className="techno" key={ key++ }>
                    <span className="punc">&lt;{ elementMatches[1] }</span>
                    <span className="elName">{ elementMatches[2] }</span>
                    <span className="punc">{ elementMatches[3] }&gt;</span>
                </span>
            );
        } else if (attrMatches) {
            let name;
            if (attrMatches[1]) {
                name = <span className="atName">{ attrMatches[1] }</span>;
            }
            let value;
            if (typeof attrMatches[2] !== 'undefined') {
                let equals;
                if (name) {
                    equals = <span className="punc equals">=</span>;
                }
                value = (
                    <React.Fragment>
                        { equals }
                        <span className="punc">&quot;</span>
                        { attrMatches[2] && <span className="atValue">{ attrMatches[2] }</span> }
                        <span className="punc">&quot;</span>
                    </React.Fragment>
                );
            }

            return (
                <span className="techno" key={ key++ }>
                    { name }
                    { value }
                </span>
            );
        }
        return piece;
    });
};

export default class Bubble extends React.Component<Props> {
    public constructor(props: Props) {
        super(props);
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
        const { actions, docSpec, element, id, left, mode, top, value, xml } = this.props;
        const asker = docSpec.elements?.[element]?.asker || askLongString;
        return (
            <div
                className={`xonomyBubble ${mode}`}
                style={{ left, top, display: 'block' }}
            >
                <div className="inside">
                    <div className="xonomyBubbleContent">
                        { asker({
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
        const { actions, docSpec, element, id, left, mode, top, xml } = this.props;

        const menu = docSpec.elements?.[element]?.menu;
        if (menu) {
            const menuItems = menu.filter(this.showMenuItem).map((menuItemSpec, index) => {
                let icon;
                if (menuItemSpec.icon) {
                    icon = (
                        <span className="icon">
                            <img src={ menuItemSpec.icon } />
                        </span>
                    );
                }
                return (
                    <div
                        className="menuItem focusme"
                        key={ index }
                        onClick={ async () => {
                            actions.setXml(await menuItemSpec.action(xml, id));
                            actions.showBubble({ show: false });
                        } }
                    >
                        { icon }
                        { formatCaption(menuItemSpec.caption) }
                    </div>
                );
            });

            return (
                <div
                    className={`xonomyBubble ${mode}`}
                    style={{ left, top, display: 'block' }}
                >
                    <div className="inside">
                        <div className="xonomyBubbleContent">
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
        const { actions, attribute, docSpec, element, id, left, mode, top, xml } = this.props;
        const menu = docSpec.elements?.[element]?.attributes?.[attribute]?.menu;
        if (menu) {
            const menuItems = menu.filter(this.showMenuItem).map((menuItemSpec, index) => (
                <div
                    className="menuItem focusme"
                    key={ index }
                    onClick={ async () => {
                        actions.setXml(await menuItemSpec.action(xml, id));
                        actions.showBubble({ show: false });
                    } }
                >
                    { menuItemSpec.caption }
                </div>
            ));

            return (
                <div className={`xonomyBubble ${mode}`} style={{ left, top, display: 'block' }}>
                    <div className="inside">
                        <div className="xonomyBubbleContent">
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

    private getAttributeAskerBubble(): React.ReactNode {
        const { actions, attribute, docSpec, element, id, left, mode, top, value, xml } = this.props;
        const attributeSpec = docSpec.elements?.[element]?.attributes?.[attribute];
        if (attributeSpec && attributeSpec.asker) {
            const asker = attributeSpec.asker;
            return (
                <div className={`xonomyBubble ${mode}`} style={{ left, top, display: 'block' }}>
                    <div className="inside">
                        <div className="xonomyBubbleContent">
                            { asker({
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
        return null;
    }

    private showMenuItem(menuItemSpec: MenuItemSpec): boolean {
        const { id, xml } = this.props;
        if (menuItemSpec.hideIf) {
            return !menuItemSpec.hideIf(xml, id);
        }
        return true;
    }
}
