import { describe, expect, test } from '@jest/globals';

import Parser from '../src/Parser';

describe('Parser', () => {
    test('parseString() should parse xml', () => {
        const parser = new Parser();
        parser.parseString('<root a="b"><item1 c="d">foo</item1></root>').then((xml) => {
            expect(JSON.stringify(xml))
                .toEqual('{"root":{"$":{"a":"b"},"#name":"root","$$":[{"_":"foo","$":{"c":"d"},"#name":"item1","$$":[{"#name":"__text__","_":"foo"}]}],"item1":[{"_":"foo","$":{"c":"d"},"$$":[{"#name":"__text__","_":"foo"}]}]}}');
        });
    });
});

