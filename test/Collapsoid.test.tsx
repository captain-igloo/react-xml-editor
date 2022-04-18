import {describe, expect, test} from '@jest/globals';
import { render } from '@testing-library/react';

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
        const { container } = render(
            <Collapsoid
                elements={elements}
            />
        );
        expect(container).toMatchSnapshot();
    });
});
