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
    askPicklist,
} from '../src/Util';

describe('Modify XML functions', () => {
    test('updateNode() should set value in xml', () => {
        const xml = {
            item: {
                '#collapsed': false,
                '#name': 'item',
            },
        };
        const newXml = updateNode(xml, ['item', '#collapsed'], true);
        expect(JSON.stringify(newXml)).toEqual('{"item":{"#collapsed":true,"#name":"item"}}');
    });

    test('newElementChild() should add child to xml', async () => {
        const xml = {
            item: {
                '#name': 'item',
            },
        };
        const newXml = await newElementChild('<child />')(xml, ['item']);
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
        const newXml = await newElementChild('<child2 />')(xml, ['item']);
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
        const newXml= await newElementBefore('<sibling />')(xml, ['item', '$$', '0']);
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
        const newXml= await newElementAfter('<sibling />')(xml, ['item', '$$', '0']);
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
        await expect(newElementAfter('<sibling />')(xml, ['item', '$$'])).rejects.toThrow();
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
        const newXml = newAttribute({
            name: 'name',
            value: 'value',
        })(xml, ['item', '$$', '0']);
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
        const newXml = deleteElement(xml, ['item', '$$', '0']);
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
        const newXml = deleteAttribute(xml, ['item', '$', 'name']);
        expect(JSON.stringify(newXml)).toEqual('{\"item\":{\"$\":{},\"#name\":\"item\"}}');
    });

    test('askString() should return <AskString /> component', () => {
        const component = renderer.create(
            askString({
                actions: {} as any,
                defaultValue: 'defaultValue',
                id: ['id'],
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
                id: ['id'],
                xml: {},
            })
        );
        expect(component.toJSON()).toMatchSnapshot();
    });

    test('askPicklist() should return <AskPicklist /> component', () => {
        const component = renderer.create(
            askPicklist([{
                value: 'short', caption: 'short'
            },{
                value: 'long', caption: 'long',
            }])({
                actions: {} as any,
                defaultValue: '',
                id: ['id'],
                xml: {},
            })
        );
        expect(component.toJSON()).toMatchSnapshot();
    });
});
