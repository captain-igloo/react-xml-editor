import { describe, expect, it, test } from '@jest/globals';

import { newElementChild, updateNode } from '../src/Util';

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
    // t.equal(JSON.stringify(newXml), '{"item":{"#name":"item","$$":[{"#name":"child"}]}}');
    // t.end();
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
    // t.end();
    // expect
});