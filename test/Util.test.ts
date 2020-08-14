import { describe, expect, test } from '@jest/globals';
import renderer from 'react-test-renderer';

import {
    askLongString,
    askString,
    deleteAttribute,
    deleteElement,
    newAttribute,
    newElementAfter,
    newElementBefore,
    newElementChild,
    updateNode,
} from '../src/Util';

describe('Modify XML functions', () => {
    test('updateNode() should set value in xml', () => {
        const xml = {
            item: {
                '#collapsed': false,
                '#name': 'item',
            },
        };
        const newXml = updateNode(xml, 'item~#collapsed', true);
        expect(JSON.stringify(newXml)).toEqual('{"item":{"#collapsed":true,"#name":"item"}}');
    });

    test('newElementChild() should add child to xml', async () => {
        const xml = {
            item: {
                '#name': 'item',
            },
        };
        const newXml = await newElementChild(xml, 'item', '<child />');
        expect(JSON.stringify(newXml)).toEqual('{"item":{"#name":"item","$$":[{"#name":"child"}]}}');
    });

    test('newElementChild() should append child after other children', async () => {
        const xml = {
            item: {
                $$: [{
                    '#name': 'child1',
                }],
                '#name': 'item',
            },
        };
        const newXml = await newElementChild(xml, 'item', '<child2 />');
        expect(JSON.stringify(newXml)).toEqual('{"item":{"$$":[{"#name":"child1"},{"#name":"child2"}],"#name":"item"}}');
    });

    test('newElementBefore() should add sibling before', async () => {
        const xml = {
            item: {
                $$: [{
                    '#name': 'child1',
                }],
                '#name': 'item',
            },
        };
        const newXml= await newElementBefore(xml, 'item~$$~0', '<sibling />');
        expect(JSON.stringify(newXml)).toEqual('{"item":{"$$":[{"#name":"sibling"},{"#name":"child1"}],"#name":"item"}}');
    });

    test('newElementAfter() should add sibling after', async () => {
        const xml = {
            item: {
                $$: [{
                    '#name': 'child1',
                }],
                '#name': 'item',
            },
        };
        const newXml= await newElementAfter(xml, 'item~$$~0', '<sibling />');
        expect(JSON.stringify(newXml)).toEqual('{"item":{"$$":[{"#name":"child1"},{"#name":"sibling"}],"#name":"item"}}');
    });

    test('newElementSibling() should return xml unmodified if id is invalid', async () => {
        const xml = {
            item: {
                $$: [{
                    '#name': 'child1',
                }],
                '#name': 'item',
            },
        };
        expect.assertions(1);
        await expect(newElementAfter(xml, 'item~$$', '<sibling />')).rejects.toThrow();
    });

    test('newAttribute() should add attribute', () => {
        const xml = {
            item: {
                $$: [{
                    '#name': 'child1',
                }],
                '#name': 'item',
            },
        };
        const newXml = newAttribute(xml, 'item~$$~0', {
            name: 'name',
            value: 'value',
        });
        expect(JSON.stringify(newXml)).toEqual('{"item":{"$$":[{"#name":"child1","$":{"name":"value"}}],"#name":"item"}}');
    })

    test('deleteElement() should delete element', () => {
        const xml = {
            item: {
                $$: [{
                    '#name': 'child1',
                }],
                '#name': 'item',
            },
        };
        const newXml = deleteElement(xml, 'item~$$~0');
        expect(JSON.stringify(newXml)).toEqual('{"item":{"$$":[null],"#name":"item"}}');
    });

    test('deleteAttribute() should delete attribute', () => {
        const xml = {
            item: {
                $: {
                    'name': 'value',
                },
                '#name': 'item',
            },
        };
        const newXml = deleteAttribute(xml, 'item~$~name');
        expect(JSON.stringify(newXml)).toEqual('{\"item\":{\"$\":{},\"#name\":\"item\"}}');
    });

    test('askString() should return <AskString /> component', () => {
        const component = renderer.create(
            askString({
                actions: {} as any,
                defaultValue: 'defaultValue',
                id: 'id',
                xml: {},
            })
        );
        expect(component.toJSON()).toMatchSnapshot();
    });

    test('askLongString() should return <AskString /> component', () => {
        const component = renderer.create(
            askLongString({
                actions: {} as any,
                defaultValue: 'defaultValue',
                id: 'id',
                xml: {},
            })
        );
        expect(component.toJSON()).toMatchSnapshot();
    });
});
