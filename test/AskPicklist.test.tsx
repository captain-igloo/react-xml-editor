import {describe, expect, jest, test} from '@jest/globals';
import renderer from 'react-test-renderer';
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

        const setXml = jest.fn();
        const showBubble = jest.fn();
        const preventDefault = jest.fn();

        const component = renderer.create(
            <AskPicklist
                actions={{setXml, showBubble} as Actions}
                id={['id']}
                parameter={parameter}
                xml={{}}
            />
        );
        const tree = component.toJSON();
        tree.children[0].props.onClick({
            preventDefault,
        });
        expect(tree).toMatchSnapshot();
        expect(setXml.mock.calls[0][0]).toEqual({
            id: 'short',
        });
        expect(showBubble.mock.calls[0][0]).toEqual({
            show: false,
        });
        expect(preventDefault.mock.calls.length).toBe(1);
    });

});