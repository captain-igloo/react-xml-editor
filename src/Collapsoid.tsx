import * as React from 'react';

import { Element } from './types';

interface Props {
    elements: Element[];
}

export default class Collapsoid extends React.Component<Props> {
    private static maxLength: number = 35;

    public render(): React.ReactNode {
        const { elements } = this.props;
        return this.renderElements(elements);
    }

    private renderElements(elements: Element[]): string {
        let collapsoid = '';
        elements.every((element: Element) => {
            if (element._ && element['#name'] === '__text__') {
                collapsoid += element._ + ' ';
            }
            if (element.$$) {
                collapsoid += this.renderElements(element.$$) + ' ';
            }
            return collapsoid.length < Collapsoid.maxLength;
        });
        return collapsoid.trim().slice(0, Collapsoid.maxLength);
    }
}
