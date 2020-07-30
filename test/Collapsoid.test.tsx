import {describe, expect, jest, test} from '@jest/globals';
import renderer from 'react-test-renderer';

import * as React from 'react';

import Collapsoid from '../src/Collapsoid';

describe('Attribute component', () => {
    test('renders properly', () => {
        const elements = [{
            _: 'text1',
            '#name': '__text__',
        },{
            '$$': [{
                _: 'text2',
                '#name': '__text__',
            }],
            '#name': 'name',
        }];
        const component = renderer.create(
            <Collapsoid
                elements={elements}
            />
        );
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });
});
