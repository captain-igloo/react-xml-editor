import {describe, expect, jest, test} from '@jest/globals';
import { fireEvent, render, waitFor } from '@testing-library/react';
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
        const { container } = render(
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
        expect(container).toMatchSnapshot();
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
        const { container } = render(
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
        expect(container).toMatchSnapshot();
    });

    test('Click attribute action should modify xml and close bubble', async () => {
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
        const { getByText } = render(
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
        fireEvent.click(getByText('Delete this attribute'));
        await waitFor(() => expect(setXml).toBeCalledWith({
            root: {
                '#name': 'root',
                '$': {},
            },
        }));
        expect(showBubble).toBeCalledWith({
            show: false,
        });
    });

    test('element bubble renders properly', async () => {
        const setXml = jest.fn();
        const showBubble = jest.fn();
        const docSpec = {
            elements: {
                element: {
                    menu: [{
                        action: deleteElement,
                        caption: 'Delete',
                    }],
                },
            },
        };
        const { container } = render(
            <Bubble
                actions={{ setXml, showBubble } as any}
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
                xml={{root: {'#name': 'root', $$: [{'#name': 'element'}]}}}
            />
        );
        expect(container).toMatchSnapshot();
    });

    test('Click element action should modify xml and close bubble', async () => {
        const setXml = jest.fn();
        const showBubble = jest.fn();
        const docSpec = {
            elements: {
                element: {
                    menu: [{
                        action: deleteElement,
                        caption: 'Delete',
                    }],
                },
            },
        };
        const { getByText } = render(
            <Bubble
                actions={{ setXml, showBubble } as any}
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
                xml={{root: {'#name': 'root', $$: [{'#name': 'element'}]}}}
            />
        );
        fireEvent.click(getByText('Delete'));
        await waitFor(() => expect(setXml).toBeCalledWith({
            root: {
                '#name': 'root',
                '$$': [],
            },
        }));
        expect(showBubble).toBeCalledWith({
            show: false,
        });
    });

    test('element bubble without menu renders properly', () => {
        const { container } = render(
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
        expect(container).toMatchSnapshot();
    });

    test('text bubble renders properly', () => {
        const { container } = render(
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
        expect(container).toMatchSnapshot();
    });

    test('bubble should not render if id is invalid', () => {
        const { container } = render(
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
        expect(container).toMatchSnapshot();
    });

    test('should not render if "show" is false', () => {
        const { container } = render(
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
        expect(container).toMatchSnapshot();
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
        const { container } = render(
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
        expect(container).toMatchSnapshot();
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
        const { container } = render(
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
        expect(container).toMatchSnapshot();
    });

    test('attribute menu bubble should be empty', async () => {
        const { container } = render(
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
        expect(container).toMatchSnapshot();
    });

    test('attribute asker bubble should be empty', () => {
        const { container } = render(
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
        expect(container).toMatchSnapshot();
    });
});
