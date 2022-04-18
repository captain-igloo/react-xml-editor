import {describe, expect, jest, test} from '@jest/globals';
import { render, fireEvent } from '@testing-library/react';
import * as React from 'react';

import Attribute from '../src/Attribute';
import { BubbleType } from '../src/types';

describe('Attribute component', () => {
    test('renders properly', () => {
        const actions = 'actions';
        const { container } = render(
            <Attribute
                actions={ actions as any }
                element="element"
                id={['id']}
                name="name"
                value="value"
            />
        );
        expect(container).toMatchSnapshot();
    });

    test('click value should open bubble', () => {
        const showBubble = jest.fn();
        const { getByText } = render(
            <Attribute
                actions={{ showBubble } as any}
                element="element"
                id={['id']}
                name="name"
                value="value"
            />
        );
        fireEvent.click(getByText('value'));
        expect(showBubble).toBeCalledWith({
            attribute: 'name',
            element: 'element',
            id: ['id'],
            left: 0,
            show: true,
            top: 0,
            type: BubbleType.ASKER,
            value: 'value',
        });
    });

    test('click name should open bubble', () => {
        const showBubble = jest.fn();
        const { getByText } = render(
            <Attribute
                actions={{ showBubble } as any}
                element="element"
                id={['id']}
                name="name"
                value="value"
            />
        );
        fireEvent.click(getByText('name'));
        expect(showBubble).toBeCalledWith({
            attribute: 'name',
            element: 'element',
            id: ['id'],
            left: 0,
            show: true,
            top: 0,
            type: BubbleType.MENU,
            value: 'value',
        });
    });
});


