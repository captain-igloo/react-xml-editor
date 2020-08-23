import {describe, expect, jest, test} from '@jest/globals';
import * as React from 'react';
import renderer from 'react-test-renderer';

import Element from '../src/Element';

describe('Element component', () => {
    test('expanded element renders properly', () => {
        const component = renderer.create(
            <Element
                actions={{} as any}
                childElements={[{'#name': 'child'}, {'#name': '__text__', _: 'text'}]}
                collapsed={ false }
                name="root"
                id={['root']}
                xml={{ root: { '#name': 'root' } }}
            />
        );
        expect(component.toJSON()).toMatchSnapshot();
    });

    test('collapsed element renders properly', () => {
        const component = renderer.create(
            <Element
                actions={{} as any}
                childElements={[{'#name': 'child'}, {'#name': '__text__', _: 'text'}]}
                collapsed
                name="root"
                id={['root']}
                xml={{ root: { '#name': 'root' } }}
            />
        );
        expect(component.toJSON()).toMatchSnapshot();
    });

    test('element with attribute renders properly', () => {
        const component = renderer.create(
            <Element
                actions={{} as any}
                attributes={{a: 'b'}}
                collapsed={ false }
                name="root"
                id={['root']}
                xml={{ root: { $: {a: 'b'}, '#name': 'root' } }}
            />
        );
        expect(component.toJSON()).toMatchSnapshot();
    });

    test('click collapse button should collapse element and hide bubble', () => {
        const setXml = jest.fn();
        const showBubble = jest.fn();
        const component = renderer.create(
            <Element
                actions={{ setXml, showBubble } as any}
                collapsed={ false }
                name="root"
                id={['root']}
                xml={{ root: { '#name': 'root' } }}
            />
        );
        component.toJSON().children[0].children[0].props.onClick();
        expect(setXml.mock.calls[0][0]).toEqual({
            root: {
                '#collapsed': true,
                '#name': 'root',
            },
        });
        expect(showBubble.mock.calls[0][0]).toEqual({
            show: false,
        });
    });

    test('click open tag should show bubble', () => {
        const showBubble = jest.fn();
        const component = renderer.create(
            <Element
                actions={{ showBubble } as any}
                collapsed={ false }
                name="root"
                id={['root']}
                xml={{ root: { '#name': 'root' } }}
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
        const stopPropagation = jest.fn();
        component.toJSON().children[1].children[1].props.onClick({
            stopPropagation,
        });
        expect(showBubble.mock.calls[0][0]).toEqual({
            element: 'root',
            id: ['root'],
            left: 88,
            show: true,
            top: 99,
            value: 'root',
        });
        expect(stopPropagation.mock.calls.length).toBe(1);
    });
});
