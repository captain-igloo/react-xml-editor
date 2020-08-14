import * as React from 'react';

import { BubbleType, Actions, BubbleOptions } from './types';

interface Props {
    actions: Actions;
    element: string;
    id: string;
    name: string;
    value: string;
}

export default class Attribute extends React.Component<Props> {
    private ref: React.RefObject<HTMLSpanElement>;

    public constructor(props: Props) {
        super(props);
        this.ref = React.createRef();
        this.onClickName = this.onClickName.bind(this);
        this.onClickValue = this.onClickValue.bind(this);
    }

    public render(): React.ReactNode {
        const { name, value } = this.props;

        return (
            <span className="attribute">
                <span className="punc"> </span>
                <span className="name" onClick={ this.onClickName }>{ name }</span>
                <span className="punc">=</span>
                <span className="valueContainer" onClick={ this.onClickValue } ref={ this.ref }>
                    <span className="punc">"</span>
                    <span className="value">{ value }</span>
                    <span className="punc">"</span>
                </span>
            </span>
        );
    }

    private onClickName(): void {
        const { actions, element, id, name, value } = this.props;
        const bubbleOptions: Partial<BubbleOptions> = {
            attribute: name,
            element,
            id,
            show: true,
            type: BubbleType.MENU,
            value,
        };
        if (this.ref.current) {
            const rect = this.ref.current.getBoundingClientRect();
            bubbleOptions.left = rect.left;
            bubbleOptions.top = rect.top;
        }
        actions.showBubble(bubbleOptions);
    }

    private onClickValue(): void {
        const { actions, element, id, name, value } = this.props;
        const bubbleOptions: Partial<BubbleOptions> = {
            attribute: name,
            element,
            id,
            show: true,
            type: BubbleType.ASKER,
            value,
        };
        if (this.ref.current) {
            const rect = this.ref.current.getBoundingClientRect();
            bubbleOptions.left = rect.left;
            bubbleOptions.top = rect.top;
        }
        actions.showBubble(bubbleOptions);
        // event.stopPropagation();
    }
}
