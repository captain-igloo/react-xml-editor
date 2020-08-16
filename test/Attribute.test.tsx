import {describe, expect, jest, test} from '@jest/globals';
import renderer from 'react-test-renderer';

import * as React from 'react';

import Attribute from '../src/Attribute';
import { BubbleType } from '../src/types';

describe('Attribute component', () => {
    test('renders properly', () => {
        const actions = 'actions';
        const component = renderer.create(
            <Attribute
                actions={ actions as any }
                element="element"
                id="id"
                name="name"
                value="value"
            />
        );
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });

    test('click name should open bubble', () => {
        const showBubble = jest.fn();
        const actions = {
            showBubble,
        };
        const id = 'id';
        const value = 'value'
        const component = renderer.create(
            <Attribute
                actions={ actions as any }
                element="element"
                id={id}
                name="name"
                value={value}
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
        let tree = component.toJSON();
        const stopPropagation = jest.fn();
        tree.children[1].props.onClick({
            stopPropagation,
        });
        expect(showBubble.mock.calls.length).toBe(1);
        expect(showBubble.mock.calls[0][0]).toEqual({
            attribute: 'name',
            element: 'element',
            id,
            left: 88,
            show: true,
            top: 99,
            type: BubbleType.MENU,
            value,
        });
        expect(stopPropagation.mock.calls.length).toBe(1);
    });

    test('click value should open bubble', () => {
        const showBubble = jest.fn();
        const actions = {
            showBubble,
        };
        const id = 'id';
        const value = 'value'
        const component = renderer.create(
            <Attribute
                actions={ actions as any }
                element="element"
                id={id}
                name="name"
                value={value}
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
        tree.children[3].props.onClick({
            stopPropagation,
        });
        expect(showBubble.mock.calls.length).toBe(1);
        expect(showBubble.mock.calls[0][0]).toEqual({
            attribute: 'name',
            element: 'element',
            id,
            left: 88,
            show: true,
            top: 99,
            type: BubbleType.ASKER,
            value,
        });
        expect(stopPropagation.mock.calls.length).toBe(1);
    });
});


