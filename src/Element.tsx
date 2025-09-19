import * as React from 'react';

import Attributes from './Attributes';
import Collapsoid from './Collapsoid';
import TextNode from './TextNode';
import { Actions, BubbleOptions, Element as ElementConfig, Xml } from './types';
import { push, updateNode } from './Util';

interface Props {
    actions: Actions;
    attributes?: { [key: string]: string };
    childElements?: ElementConfig[];
    collapsed?: boolean;
    id: string[];
    name: string;
    xml: Xml;
}

export default class Element extends React.Component<Props> {
    private ref: React.RefObject<HTMLDivElement | null>;

    public constructor(props: Props) {
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
            childElements.forEach((childElement: ElementConfig, index: number) => {
                if (childElement['#name'] !== '__text__') {
                    elements.push(
                        <Element
                            actions={actions}
                            attributes={childElement.$}
                            childElements={childElement.$$}
                            collapsed={childElement['#collapsed']}
                            id={push(id, '$$', `${index}`)}
                            key={index}
                            name={childElement['#name']}
                            xml={xml}
                        />,
                    );
                } else if (childElement._) {
                    elements.push(
                        <TextNode
                            actions={actions}
                            element={name}
                            id={push(id, '$$', `${index}`, '_')}
                            key={index}
                            text={childElement._}
                        />,
                    );
                }
            });
        }

        const childrenContainer = (
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
        let expandCollapseLabel = 'Collapse';
        if (collapsed) {
            elementClass += ' collapsed';
            expandCollapseLabel = 'Expand';
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
                <span className="tag closing">
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
                        <span className="plusminus" onClick={ this.onCollapse } title={ expandCollapseLabel } />
                        <span className="draghandle" draggable="true" />
                    </span>
                    { openingTag }
                    { childrenContainer }
                    { closingTag }
                </div>
            </React.Fragment>
        );
    }

    private onClick(event: React.MouseEvent) {
        const { actions, id, name } = this.props;
        const bubbleOptions: Partial<BubbleOptions> = {
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
        event.stopPropagation();
    }

    private onCollapse() {
        const { actions, collapsed, id, xml } = this.props;
        const collapseId = push(id, '#collapsed');
        actions.showBubble({
            show: false,
        });
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
