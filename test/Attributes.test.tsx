import { describe, expect, test } from '@jest/globals';
import { render } from '@testing-library/react';
import * as React from 'react';

import Attributes from '../src/Attributes';

describe('Attributes component', () => {
    test('renders properly', () => {
        const actions = 'actions';
        const { container } = render(
            <Attributes
                actions={actions as any}
                attributes={{ a: 'b' }}
                element="element"
                id={['id']}
            />,
        );
        expect(container).toMatchSnapshot();
    });
});
