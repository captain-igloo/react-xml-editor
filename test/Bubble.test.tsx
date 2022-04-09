import {describe, expect, jest, test} from '@jest/globals';
import renderer from 'react-test-renderer';

import * as React from 'react';

import Bubble from '../src/Bubble';
import { BubbleType } from '../src/types';
import { askString, deleteAttribute, deleteElement } from '../src/Util';

describe('Bubble component', () => {
    test('attribute asker bubble renders properly', () => {
        const docSpec = {
            elements: {
                root: {
                    attributes: {
                        attribute: {
                            asker: askString,
                        },
                    },
                },
            },
        };

        const component = renderer.create(
            <Bubble
                actions={{} as any}
                attribute="attribute"
                docSpec={docSpec}
                element="root"
                id={['root', '$', 'attribute']}
                left={0}
                mode="nerd"
                show
                top={0}
                type={BubbleType.ASKER}
                value="value"
                xml={{}}
            />
        );
        expect(component.toJSON()).toMatchSnapshot();
    });

    test('attribute menu bubble renders properly', async () => {
        const docSpec = {
            elements: {
                root: {
                    attributes: {
                        attribute: {
                            menu: [{
                                action: deleteAttribute,
                                caption: 'Delete this attribute',
                            }],
                        },
                    },
                },
            },
        };

        const setXml = jest.fn();
        const showBubble = jest.fn();

        const component = renderer.create(
            <Bubble
                actions={{ setXml, showBubble } as any}
                attribute="attribute"
                docSpec={docSpec}
                element="root"
                id={['root', '$', 'attribute']}
                left={0}
                mode="nerd"
                show
                top={0}
                type={BubbleType.MENU}
                value="value"
                xml={{root: {'#name': 'root', $: {'attribute': 'value'}}}}
            />
        );
        const tree = component.toJSON();
        expect(tree).toMatchSnapshot();
        await tree.children[0].children[0].children[0].children[0].props.onClick();
        expect(setXml.mock.calls[0][0]).toEqual({
            root: {
                '#name': 'root',
                $: {},
            },
        });
        expect(showBubble.mock.calls[0][0]).toEqual({
            show: false,
        });
    });

    test('element bubble renders properly', () => {
        const docSpec = {
            elements: {
                element: {
                    menu: [{
                        action: deleteElement,
                        caption: 'Delete this <element />',
                    }],
                },
            },
        };

        const component = renderer.create(
            <Bubble
                actions={{} as any}
                attribute="attribute"
                docSpec={docSpec}
                element="element"
                id={['root', '$$', '0']}
                left={0}
                mode="nerd"
                show
                top={0}
                type={BubbleType.ASKER}
                value="value"
                xml={{}}
            />
        );
        expect(component.toJSON()).toMatchSnapshot();
    });

    test('element bubble without menu renders properly', () => {
        const component = renderer.create(
            <Bubble
                actions={{} as any}
                attribute="attribute"
                docSpec={{}}
                element="element"
                id={['root', '$$', '0']}
                left={0}
                mode="nerd"
                show
                top={0}
                type={BubbleType.ASKER}
                value="value"
                xml={{}}
            />
        );
        expect(component.toJSON()).toMatchSnapshot();
    });

    test('text bubble renders properly', () => {
        const component = renderer.create(
            <Bubble
                actions={{} as any}
                attribute="attribute"
                docSpec={{}}
                element="element"
                id={['root', '_']}
                left={0}
                mode="nerd"
                show
                top={0}
                type={BubbleType.ASKER}
                value="value"
                xml={{}}
            />
        );
        expect(component.toJSON()).toMatchSnapshot();
    });

    test('bubble should not render if id is invalid', () => {
        const component = renderer.create(
            <Bubble
                actions={{} as any}
                attribute="attribute"
                docSpec={{}}
                element="element"
                id={['invalid']}
                left={0}
                mode="nerd"
                show
                top={0}
                type={BubbleType.ASKER}
                value="value"
                xml={{}}
            />
        );
        expect(component.toJSON()).toBeNull();
    });

    test('should not render if "show" is false', () => {
        const component = renderer.create(
            <Bubble
                actions={{} as any}
                attribute="attribute"
                docSpec={{}}
                element="element"
                id={['id']}
                left={0}
                mode="nerd"
                show={false}
                top={0}
                type={BubbleType.ASKER}
                value=""
                xml={{}}
            />
        );
        expect(component.toJSON()).toBeNull();
    });

    test('captions should be correctly formatted', () => {
        const docSpec = {
            elements: {
                element: {
                    menu: [{
                        action: deleteElement,
                        caption: '<element />',
                        icon: 'icon.png',
                    },{
                        action: deleteElement,
                        caption: '@key="value"',
                    },{
                        action: deleteElement,
                        caption: '@key',
                    },{
                        action: deleteElement,
                        caption: '@key=""',
                    },{
                        action: deleteElement,
                        caption: '@"value"',
                    }],
                },
            },
        };
        const component = renderer.create(
            <Bubble
                actions={{} as any}
                attribute="attribute"
                docSpec={docSpec}
                element="element"
                id={['root', '$$', '0']}
                left={0}
                mode="nerd"
                show
                top={0}
                type={BubbleType.MENU}
                value="value"
                xml={{root: {'#name': 'root', $$: [{'#name': 'element'}]}}}
            />
        );
        expect(component.toJSON()).toMatchSnapshot();
    });

    test('menu item should be hidden if hideIf() returns true', () => {
        const docSpec = {
            elements: {
                element: {
                    menu: [{
                        action: deleteElement,
                        caption: 'Delete this <element />',
                        hideIf: () => true,
                    }],
                },
            },
        };
        const component = renderer.create(
            <Bubble
                actions={{} as any}
                attribute="attribute"
                docSpec={docSpec}
                element="element"
                id={['root', '$$', '0']}
                left={0}
                mode="nerd"
                show
                top={0}
                type={BubbleType.MENU}
                value="value"
                xml={{root: {'#name': 'root', $$: [{'#name': 'element'}]}}}
            />
        );
        expect(component.toJSON()).toMatchSnapshot();
    });

    test('attribute menu bubble should be empty', async () => {
        const component = renderer.create(
            <Bubble
                actions={{} as any}
                attribute="attribute"
                docSpec={{}}
                element="root"
                id={['root', '$', 'attribute']}
                left={0}
                mode="nerd"
                show
                top={0}
                type={BubbleType.MENU}
                value="value"
                xml={{root: {'#name': 'root', $: {'attribute': 'value'}}}}
            />
        );
        expect(component.toJSON()).toMatchSnapshot();
    });

    test('attribute asker bubble should be empty', () => {
        const component = renderer.create(
            <Bubble
                actions={{} as any}
                attribute="attribute"
                docSpec={{}}
                element="root"
                id={['root', '$', 'attribute']}
                left={0}
                mode="nerd"
                show
                top={0}
                type={BubbleType.ASKER}
                value="value"
                xml={{}}
            />
        );
        expect(component.toJSON()).toMatchSnapshot();
    });
});
