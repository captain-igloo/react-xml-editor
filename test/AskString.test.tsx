import {describe, expect, jest, test} from '@jest/globals';
import renderer from 'react-test-renderer';
import * as React from 'react';

import AskString, { AskStringType } from '../src/AskString';
import { Actions, Xml } from '../src/types';

describe('AskString component', () => {
    test('ask short string renders properly', () => {
        const component = renderer.create(
            <AskString
                actions={{} as Actions}
                defaultValue="defaultValue"
                id="id"
                type={ AskStringType.SHORT }
                xml={ {} as Xml }
            />
        );
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });

    test('change', () => {
        const component = renderer.create(
            <AskString
                actions={{} as any} 
                defaultValue="defaultValue"
                id="id"
                type={ AskStringType.SHORT }
                xml={ {} as Xml }
            />
        );  
        let tree = component.toJSON();
        tree.children[0].props.onChange({
            target: {
                value: 'new value',
            }
        });
        tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });

    test('submit should set value in xml', () => {
        const setXml = jest.fn();
        const showBubble = jest.fn();
        const actions = {
            setXml,
            showBubble,
        };
        const component = renderer.create(
            <AskString
                actions={actions as any} 
                defaultValue="defaultValue"
                id="id"
                type={ AskStringType.SHORT }
                xml={ {} as Xml }
            />
        );
        const tree = component.toJSON();
        const preventDefault = jest.fn();
        tree.props.onSubmit({
            preventDefault,
        });
        expect(setXml.mock.calls[0][0]).toEqual({
            id: 'defaultValue',
        });
        expect(showBubble.mock.calls[0][0]).toEqual({
            show: false,
        });
        expect(preventDefault.mock.calls.length).toBe(1);
    });

    test('ask long string renders properly', () => {
        const component = renderer.create(
            <AskString
                actions={{} as Actions}
                defaultValue="defaultValue"
                id="id"
                type={ AskStringType.LONG }
                xml={ {} as Xml }
            />
        );
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });
});
