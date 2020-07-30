import * as React from 'react';

import { IActions, IBubbleOptions } from './types';

interface IProps {
    actions: IActions;
    id: string;
    text: string;
}

export default class Element extends React.Component<IProps> {
    private ref: React.RefObject<HTMLDivElement>;

    public constructor(props: IProps) {
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
                { text }
            </div>
        );
    }

    private onClick(): void {
        const { actions, id, text } = this.props;
        const bubbleOptions: Partial<IBubbleOptions> = {
            id,
            element: name,
            show: true,
            value: text,
        };
        if (this.ref.current) {
            const rect = this.ref.current.getBoundingClientRect();
            bubbleOptions.left = rect.left;
            bubbleOptions.top = rect.top;
        }
        // console.log('SHOW BUBBLE bubbleOptions', bubbleOptions);
        actions.showBubble(bubbleOptions);
    }
}
