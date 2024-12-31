import * as React from 'react';

import { Actions, BubbleOptions } from './types';

interface Props {
    actions: Actions;
    element: string;
    id: string[];
    text: string;
}

export default class TextNode extends React.Component<Props> {
    private ref: React.RefObject<HTMLDivElement | null>;

    public constructor(props: Props) {
        super(props);
        this.onClick = this.onClick.bind(this);
        this.ref = React.createRef();
    }

    public render(): React.ReactNode {
        const { text } = this.props;
        return (
            <div
                className="textnode focusable"
                onClick={this.onClick}
                ref={this.ref}
            >
                <span className="value">{ text }</span>
            </div>
        );
    }

    private onClick(event: React.MouseEvent): void {
        const { actions, element, id, text } = this.props;
        const bubbleOptions: Partial<BubbleOptions> = {
            id,
            element,
            show: true,
            value: text,
        };
        if (this.ref.current) {
            const rect = this.ref.current.getBoundingClientRect();
            bubbleOptions.left = rect.left;
            bubbleOptions.top = rect.top;
        }
        actions.showBubble(bubbleOptions);
        event.stopPropagation();
    }
}
