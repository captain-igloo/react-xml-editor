import * as React from 'react';

import Attributes from './Attributes';
import Collapsoid from './Collapsoid';
import { IElement } from './Parser';
import TextNode from './TextNode';
import { IActions, IBubbleOptions, IXml } from './types';
import { updateNode } from './Util';

interface IProps {
    actions: IActions;
    attributes?: {[key: string]: string};
    childElements?: IElement[];
    collapsed?: boolean;
    id: string;
    name: string;
    xml: IXml;
}

export default class Element extends React.Component<IProps> {
    private ref: React.RefObject<HTMLDivElement>;

    public constructor(props: IProps) {
        super(props);
        this.onCollapse = this.onCollapse.bind(this);
        this.onClick = this.onClick.bind(this);
        this.ref = React.createRef();
    }

    public render(): React.ReactNode {
        const {
            actions,
            childElements,
            collapsed,
            id,
            name,
            xml,
        } = this.props;

        const elements: React.ReactNode[] = [];
        if (childElements) {
            childElements.forEach((childElement: IElement, index: number) => {
                if (childElement['#name'] !== '__text__') {
                    elements.push(
                        <Element
                            actions={actions}
                            attributes={childElement.$}
                            childElements={childElement.$$}
                            collapsed={childElement['#collapsed']}
                            id={`${id}~\$\$~${index}`}
                            key={index}
                            name={childElement['#name']}
                            xml={xml}
                        />
                    );
                } else if (childElement._) {
                    elements.push(
                        <TextNode
                            actions={actions}
                            id={ `${id}~\$\$~${index}~_` }
                            key={index}
                            text={ childElement._ }
                        />
                    );
                }
            });
        }

        let childrenContainer;
        childrenContainer = (
            <React.Fragment>
                <span className="prominentChildren"/>
                <span className="childrenCollapsed focusable">
                    {childElements && <Collapsoid elements={ childElements }/> }
                </span>
                <div className="children">
                    { elements }
                </div>
            </React.Fragment>
        );

        let elementClass = '';
        if (elements.length === 0) {
            elementClass = ' noChildren';
        }
        if (collapsed) {
            elementClass += ' collapsed';
        }

        const openingTag = (
            <span className="tag opening">
                <span className="punc">&lt;</span>
                <span className="name" onClick={ this.onClick } ref={ this.ref }>{ name }</span>
                { this.getAttributes() }
                <span className="punc slash">/</span>
                <span className="punc">&gt;</span>
            </span>
        );

        let closingTag;
        if (elements.length > 0) {
            closingTag = (
                <span className="tag">
                    <span className="punc">&lt;</span>
                    <span className="punc slash">/</span>
                    <span className="name">{ name }</span>
                    <span className="punc">&gt;</span>
                </span>
            );
        }

        return (
            <React.Fragment>
                <div className={`element${elementClass}`}>
                    <span className="connector">
                        <span className="plusminus" onClick={ this.onCollapse } />
                        <span className="draghandle" draggable="true" />
                    </span>
                    { openingTag }
                    { childrenContainer }
                    { closingTag }
                </div>
            </React.Fragment>
        );
    }

    private onClick() {
        const { actions, id, name } = this.props;
        const bubbleOptions: Partial<IBubbleOptions> = {
            id,
            element: name,
            show: true,
            value: name,
        };
        if (this.ref.current) {
            const rect = this.ref.current.getBoundingClientRect();
            bubbleOptions.left = rect.left;
            bubbleOptions.top = rect.top;
        }
        actions.showBubble(bubbleOptions);
    }

    private onCollapse() {
        const { actions, collapsed, id, xml } = this.props;
        const collapseId = `${id}~#collapsed`;
        actions.setXml(updateNode(xml, collapseId, !collapsed));
    }

    private getAttributes() {
        const { actions, attributes, id, name } = this.props;
        if (attributes) {
            return (
                <Attributes
                    actions={ actions }
                    attributes={ attributes }
                    element={ name }
                    id={ id }
                />
            );
        }
        return null;
    }
}
