import { describe, expect, jest, test } from '@jest/globals';
import { fireEvent, render } from '@testing-library/react';
import * as React from 'react';

import Element from '../src/Element';

describe('Element component', () => {
    test('expanded element renders properly', () => {
        const { container } = render(
            <Element
                actions={{} as any}
                childElements={[{'#name': 'child'}, {'#name': '__text__', _: 'text'}]}
                collapsed={ false }
                name="root"
                id={['root']}
                xml={{ root: { '#name': 'root' } }}
            />
        );
        expect(container).toMatchSnapshot();
    });

    test('collapsed element renders properly', () => {
        const { container } = render(
            <Element
                actions={{} as any}
                childElements={[{'#name': 'child'}, {'#name': '__text__', _: 'text'}]}
                collapsed
                name="root"
                id={['root']}
                xml={{ root: { '#name': 'root' } }}
            />
        );
        expect(container).toMatchSnapshot();
    });

    test('element with attribute renders properly', () => {
        const { container } = render(
            <Element
                actions={{} as any}
                attributes={{a: 'b'}}
                collapsed={ false }
                name="root"
                id={['root']}
                xml={{ root: { $: {a: 'b'}, '#name': 'root' } }}
            />
        );
        expect(container).toMatchSnapshot();
    });

    test('click collapse button should collapse element and hide bubble', () => {
        const setXml = jest.fn();
        const showBubble = jest.fn();
        const { getByTitle } = render(
            <Element
                actions={{ setXml, showBubble } as any}
                collapsed={ false }
                name="root"
                id={['root']}
                xml={{ root: { '#name': 'root' } }}
            />
        );
        fireEvent.click(getByTitle('Collapse'));
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
        const { getByText } = render(
            <Element
                actions={{ showBubble } as any}
                collapsed={ false }
                name="root"
                id={['root']}
                xml={{ root: { '#name': 'root' } }}
            />
        );
        fireEvent.click(getByText('root'));
        expect(showBubble.mock.calls[0][0]).toEqual({
            element: 'root',
            id: ['root'],
            left: 0,
            show: true,
            top: 0,
            value: 'root',
        });
    });
});
