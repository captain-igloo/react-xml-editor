import {describe, expect, test} from '@jest/globals';
import * as React from 'react';
import renderer from 'react-test-renderer';

import Attributes from '../src/Attributes';

describe('Attributes component', () => {
    test('renders properly', () => {
        const actions = 'actions';
        const component = renderer.create(
            <Attributes 
                actions={actions as any}
                attributes={{a: 'b'}}
                element="element"
                id="id"
            />
        );
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });
});