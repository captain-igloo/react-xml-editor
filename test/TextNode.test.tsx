import {describe, expect, jest, test} from '@jest/globals';
import * as React from 'react';
import renderer from 'react-test-renderer';

import TextNode from '../src/TextNode';

describe('TextNode component', () => {
    test('text node renders properly', () => {
        const showBubble = jest.fn();
        const component = renderer.create(
            <TextNode
                actions={{ showBubble } as any}
                element="element"
                id={['id']}
                text="text"
            />,{
                createNodeMock: () => {
                    return {
                        getBoundingClientRect: () => ({
                            left: 88,
                            top: 99,
                        }),
                    };
                }
            }
        );
        const tree = component.toJSON();
        const stopPropagation = jest.fn();
        tree.props.onClick({
            stopPropagation,
        });
        expect(tree).toMatchSnapshot();
        expect(stopPropagation.mock.calls.length).toBe(1);
        expect(showBubble.mock.calls.length).toBe(1);
        expect(showBubble.mock.calls[0][0]).toEqual({
            element: 'element',
            id: ['id'],
            left: 88,
            show: true,
            top: 99,
            value: 'text',
        });
    });
});
