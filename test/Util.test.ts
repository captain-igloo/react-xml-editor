import { describe, expect, test } from '@jest/globals';
import { render } from '@testing-library/react';

import {
    askLongString,
    askString,
    canMoveElementDown,
    canMoveElementUp,
    deleteAttribute,
    deleteElement,
    duplicateElement,
    moveElementDown,
    moveElementUp,
    newAttribute,
    newElementAfter,
    newElementBefore,
    newElementChild,
    newTextChild,
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

    test('newTextChild() should add text child', async () => {
        const xml = {
            item: {
                '#name': 'item',
            },
        };
        const newXml = await newTextChild('text')(xml, ['item']);
        expect(JSON.stringify(newXml)).toEqual('{"item":{"#name":"item","$$":[{"#name":"__text__","_":"text"}]}}');
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
        const newXml = await newElementBefore('<sibling />')(xml, ['item', '$$', '0']);
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
        const newXml = await newElementAfter('<sibling />')(xml, ['item', '$$', '0']);
        expect(JSON.stringify(newXml)).toEqual('{"item":{"$$":[{"#name":"child1"},{"#name":"sibling"}],"#name":"item"}}');
    });

    test('duplicateElement() should add copy of element', () => {
        const xml = {
            item: {
                $$: [{
                    '#name': 'child1',
                }],
                '#name': 'item',
            },
        };
        const newXml = duplicateElement(xml, ['item', '$$', '0']);
        expect(JSON.stringify(newXml)).toEqual('{"item":{"$$":[{"#name":"child1"},{"#name":"child1"}],"#name":"item"}}');
    });

    test('duplicateElement() should throw if node does not exist in xml', () => {
        const xml = {
            item: {
                '#name': 'item',
            },
        };
        expect(() => {
            duplicateElement(xml, ['item', '$$', '0']);
        }).toThrow();
    });

    test('duplicateElement() should throw if id is invalid', () => {
        const xml = {
            item: {
                $$: [{
                    '#name': 'child1',
                }],
                '#name': 'item',
            },
        };
        expect(() => {
            duplicateElement(xml, ['item', '$$']);
        }).toThrow();
    });

    test('moveElementUp() should move element up', () => {
        const xml = {
            item: {
                $$: [{
                    '#name': 'child1',
                }, {
                    '#name': 'child2',
                }],
                '#name': 'item',
            },
        };
        const newXml = moveElementUp(xml, ['item', '$$', '1']);
        expect(JSON.stringify(newXml)).toEqual('{"item":{"$$":[{"#name":"child2"},{"#name":"child1"}],"#name":"item"}}');
    });

    test('moveElementDown() should move element down', () => {
        const xml = {
            item: {
                $$: [{
                    '#name': 'child1',
                }, {
                    '#name': 'child2',
                }],
                '#name': 'item',
            },
        };
        const newXml = moveElementDown(xml, ['item', '$$', '0']);
        expect(JSON.stringify(newXml)).toEqual('{"item":{"$$":[{"#name":"child2"},{"#name":"child1"}],"#name":"item"}}');
    });

    test('canMoveElementUp() should return true if element index > 0', () => {
        expect(canMoveElementUp({}, ['1'])).toEqual(true);
    });

    test('canMoveElementUp() should return false if element index == 0', () => {
        expect(canMoveElementUp({}, ['0'])).toEqual(false);
    });

    test('canMoveElementUp() should return false id is invalid', () => {
        expect(canMoveElementUp({}, [])).toEqual(false);
    });

    test('canMoveElementDown() should return true if element is not last', () => {
        const xml = {
            item: {
                $$: [{
                    '#name': 'child1',
                }, {
                    '#name': 'child2',
                }],
                '#name': 'item',
            },
        };
        expect(canMoveElementDown(xml, ['item', '$$', '0'])).toEqual(true);
    });

    test('canMoveElementDown() should return false if element is last', () => {
        const xml = {
            item: {
                $$: [{
                    '#name': 'child1',
                }, {
                    '#name': 'child2',
                }],
                '#name': 'item',
            },
        };
        expect(canMoveElementDown(xml, ['item', '$$', '1'])).toEqual(false);
    });

    test('newElementSibling() should throw if id is invalid', async () => {
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
    });

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
        expect(JSON.stringify(newXml)).toEqual('{"item":{"$$":[],"#name":"item"}}');
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
        const { container } = render(
            askString({
                actions: {} as any,
                defaultValue: 'defaultValue',
                id: ['id'],
                xml: {},
            }),
        );
        expect(container).toMatchSnapshot();
    });

    test('askLongString() should return <AskString /> component', () => {
        const { container } = render(
            askLongString({
                actions: {} as any,
                defaultValue: 'defaultValue',
                id: ['id'],
                xml: {},
            }),
        );
        expect(container).toMatchSnapshot();
    });

    test('askPicklist() should return <AskPicklist /> component', () => {
        const { container } = render(
            askPicklist([{
                value: 'short',
                caption: 'short',
            }, {
                value: 'long',
                caption: 'long',
            }])({
                actions: {} as any,
                defaultValue: '',
                id: ['id'],
                xml: {},
            }),
        );
        expect(container).toMatchSnapshot();
    });
});
