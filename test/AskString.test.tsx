import { describe, expect, jest, test } from '@jest/globals';
import { render, fireEvent } from '@testing-library/react';
import * as React from 'react';

import AskString, { AskStringType } from '../src/AskString';
import { Actions, Xml } from '../src/types';

describe('AskString component', () => {
    test('ask short string renders properly', () => {
        const { container } = render(
            <AskString
                actions={{} as Actions}
                defaultValue="defaultValue"
                id={['id']}
                type={ AskStringType.SHORT }
                xml={ {} as Xml }
            />,
        );
        expect(container).toMatchSnapshot();
    });

    test('Click OK should set xml and hide bubble', () => {
        const setXml = jest.fn();
        const showBubble = jest.fn();
        const { getByDisplayValue, getByLabelText } = render(
            <AskString
                actions={{ setXml, showBubble } as any}
                defaultValue="defaultValue"
                id={['id']}
                type={ AskStringType.SHORT }
                xml={ {} as Xml }
            />,
        );
        fireEvent.change(getByLabelText('Value'), {
            target: {
                value: 'new value',
            },
        });
        fireEvent.click(getByDisplayValue('OK'));
        expect(setXml).toHaveBeenCalledWith({
            id: 'new value',
        });
        expect(showBubble).toHaveBeenCalledWith({
            show: false,
        });
    });

    test('asdf', () => {
        const { container, rerender } = render(
            <AskString
                actions={{ } as any}
                defaultValue="defaultValue"
                id={['id']}
                type={ AskStringType.LONG }
                xml={ {} as Xml }
            />,
        );
        rerender(
            <AskString
                actions={{ } as any}
                defaultValue="newValue"
                id={['id']}
                type={ AskStringType.LONG }
                xml={ {} as Xml }
            />,
        );
        expect(container).toMatchSnapshot();
        expect(true).toBe(true);
    });
});
