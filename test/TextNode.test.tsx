import {
    describe,
    expect,
    jest,
    test,
} from '@jest/globals';
import { fireEvent, render } from '@testing-library/react';
import * as React from 'react';

import TextNode from '../src/TextNode';

describe('TextNode component', () => {
    test('text node renders properly', () => {
        const { container } = render(
            <TextNode
                actions={{} as any}
                element="element"
                id={['id']}
                text="text"
            />,
        );
        expect(container).toMatchSnapshot();
    });

    test('Click should show bubble', () => {
        const showBubble = jest.fn();
        const { getByText } = render(
            <TextNode
                actions={{ showBubble } as any}
                element="element"
                id={['id']}
                text="text"
            />,
        );
        fireEvent.click(getByText('text'));
        expect(showBubble).toHaveBeenCalledWith({
            element: 'element',
            id: ['id'],
            left: 0,
            show: true,
            top: 0,
            value: 'text',
        });
    });
});
