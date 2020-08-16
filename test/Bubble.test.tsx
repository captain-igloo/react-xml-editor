import {describe, expect, test} from '@jest/globals';
import renderer from 'react-test-renderer';

import * as React from 'react';

import Bubble from '../src/Bubble';
import { BubbleType, DocSpec } from '../src/types';
import { askString, deleteElement } from '../src/Util';

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
                id="root~$~attribute"
                left={0}
                show
                top={0}
                type={BubbleType.ASKER}
                value="value"
                xml={{}}
            />
        );
        expect(component.toJSON()).toMatchSnapshot();
    });

    test('attribute menu bubble renders properly', () => {
        const docSpec = {
            elements: {
                root: {
                    attributes: {
                        attribute: {
                            menu: [{
                                action: deleteElement,
                                caption: 'Delete this <item />',
                            }],
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
                id="root~$~attribute"
                left={0}
                show
                top={0}
                type={BubbleType.MENU}
                value="value"
                xml={{}}
            />
        );
        expect(component.toJSON()).toMatchSnapshot();
    });

    test('element bubble renders properly', () => {
        const component = renderer.create(
            <Bubble
                actions={{} as any}
                attribute="attribute"
                docSpec={{}}
                element="element"
                id="root~$$~0"
                left={0}
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
                id="root~_"
                left={0}
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
                id="invalid"
                left={0}
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
                id="id"
                left={0}
                show={false}
                top={0}
                type={BubbleType.ASKER}
                value=""
                xml={{}}
            />
        );
        expect(component.toJSON()).toBeNull();
    });
});
