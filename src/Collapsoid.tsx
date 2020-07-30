import * as React from 'react';

import { IElement } from './Parser';

interface IProps {
    elements: IElement[];
}

export default class Collapsoid extends React.Component<IProps> {
    private static maxLength: number = 35;

    public render(): React.ReactNode {
        const { elements } = this.props;
        return this.renderElements(elements);
    }

    private renderElements(elements: IElement[]): string {
        let collapsoid = '';
        elements.every((element: IElement) => {
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
