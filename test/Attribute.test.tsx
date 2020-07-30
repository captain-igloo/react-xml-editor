import {describe, expect, jest, test} from '@jest/globals';
import renderer from 'react-test-renderer';

import * as React from 'react';

import Attribute from '../src/Attribute';
import { EBubbleType } from '../src/types';

describe('Attribute component', () => {
    test('renders properly', () => {
        const actions = 'actions';
        const component = renderer.create(
            <Attribute
                actions={ actions as any }
                element="asdf"
                id="asdf"
                name="asdf"
                value="asdf"
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
                name="asdf"
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
        tree.children[1].props.onClick();
        expect(showBubble.mock.calls.length).toBe(1);
        expect(showBubble.mock.calls[0][0]).toEqual({
            attribute: 'asdf',
            element: 'element',
            id,
            left: 88,
            show: true,
            top: 99,
            type: EBubbleType.MENU,
            value,
        });
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
                name="asdf"
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
        tree.children[3].props.onClick();
        expect(showBubble.mock.calls.length).toBe(1);
        expect(showBubble.mock.calls[0][0]).toEqual({
            attribute: 'asdf',
            element: 'element',
            id,
            left: 88,
            show: true,
            top: 99,
            type: EBubbleType.ASKER,
            value,
        });
    });
});


