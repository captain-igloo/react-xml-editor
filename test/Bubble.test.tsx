import {describe, expect, test} from '@jest/globals';
import renderer from 'react-test-renderer';

import * as React from 'react';

import Bubble from '../src/Bubble';
import { BubbleType } from '../src/types';

describe('Bubble component', () => {
    test('renders properly', () => {

        const component = renderer.create(
            <Bubble
                actions={{} as any}
                attribute="attribute"
                docSpec={{}}
                element="asdf"
                id="asdf"
                left={0}
                show
                top={0}
                type={BubbleType.ASKER}
                value="value"
                xml={{}}
            />
        );
        const tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });
});
