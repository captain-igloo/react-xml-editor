import { describe, expect, jest, test } from '@jest/globals';
import { render, fireEvent } from '@testing-library/react';
import * as React from 'react';

import AskPicklist from '../src/AskPicklist';
import { Actions } from '../src/types';

describe('AskPicklist component', () => {
    test('AskPicklist renders properly', () => {
        const parameter = [{
            value: 'short', caption: 'short'
        },{
            value: 'medium', caption: 'medium',
        }, 'long'];
        const { container } = render(
            <AskPicklist
                actions={{} as Actions}
                id={['id']}
                parameter={parameter}
                xml={{}}
            />
        );
        expect(container).toMatchSnapshot();
    });

    test('Click value should set xml and hide bubble', () => {
        const setXml = jest.fn();
        const showBubble = jest.fn();
        const parameter = [{
            value: 'short', caption: 'short'
        },{
            value: 'medium', caption: 'medium',
        }, 'long'];
        const { getAllByText } = render(
            <AskPicklist
                actions={{ setXml, showBubble } as Actions}
                id={['id']}
                parameter={parameter}
                xml={{}}
            />
        );
        fireEvent.click(getAllByText('short')[0]);
        expect(setXml).toBeCalledWith({
            id: 'short',
        });
        expect(showBubble).toBeCalledWith({
            show: false,
        })
    });
});
