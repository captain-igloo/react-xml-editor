import {describe, expect, test} from '@jest/globals';

import Builder from '../src/Builder';

describe('Builder', () => {
    test('build xml', () => {
        const builder = new Builder({});

        const xml = builder.buildObject({
            root: {
                '#name': 'root',
            },
        });

        expect(xml).toBe('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<root/>');
    });

    test('build invalid xml should throw', () => {
        const builder = new Builder({});
        expect(() => {
            builder.buildObject({});
        }).toThrow();
    });

    test('build xml with attribute', () => {
        const builder = new Builder({});
        const xml = builder.buildObject({
            root: {
                '#name': 'root',
                $: {
                    a: 'b',
                },
            },
        });
        expect(xml).toBe('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<root a="b"/>');
    });

    test('build xml with child', () => {
        const builder = new Builder({});
        const xml = builder.buildObject({
            root: {
                '#name': 'root',
                $$: [{
                    '#name': 'child',
                }],
            },
        });
        expect(xml).toBe('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<root>\n  <child/>\n</root>');
    });

    test('build xml with text', () => {
        const builder = new Builder({});
        const xml = builder.buildObject({
            root: {
                '#name': 'root',
                $$: [{
                    '#name': '__text__',
                    _: 'text',
                }],
            },
        });
        expect(xml).toBe('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<root>text</root>');
    });
});
