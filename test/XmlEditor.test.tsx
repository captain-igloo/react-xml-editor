import {describe, expect, test} from '@jest/globals';
import * as React from 'react';
import renderer from 'react-test-renderer';

import XmlEditor from '../src/XmlEditor';

describe('XmlEditor component', () => {
    test('xml editor renders properly', () => {
        const ref: React.RefObject<XmlEditor> = React.createRef();
        const component = renderer.create(
            <XmlEditor
                docSpec={{}}
                ref={ref}
                xml="<xml />"
            />
        );
        const tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });

    test('getXml() returns xml', () => {
        const ref: React.RefObject<XmlEditor> = React.createRef();
        renderer.create(
            <XmlEditor
                docSpec={{}}
                ref={ref}
                xml="<xml />"
            />
        );
        expect(ref.current.getXml()).toBe(undefined);
    });

    test('click should hide bubble', () => {
        const component = renderer.create(
            <XmlEditor
                docSpec={{}}
                ref={React.createRef()}
                xml="<xml />"
            />
        );
        component.toJSON().props.onClick();
        expect(component.getInstance().state.bubble.show).toBe(false);
    });
});
