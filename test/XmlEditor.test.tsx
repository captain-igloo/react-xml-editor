import { describe, expect, jest, test } from '@jest/globals';
import { fireEvent, render, waitFor } from '@testing-library/react';
import * as React from 'react';

import * as Util from '../src/Util';
import XmlEditor from '../src/XmlEditor';

describe('XmlEditor component', () => {
    test('xml editor renders properly', () => {
        const ref: React.RefObject<XmlEditor> = React.createRef();
        const { container } = render(
            <XmlEditor
                docSpec={{}}
                ref={ref}
                xml="<xml />"
            />,
        );
        expect(container).toMatchSnapshot();
    });

    test('getXml() returns xml', () => {
        const ref: React.RefObject<XmlEditor> = React.createRef();
        render(
            <XmlEditor
                docSpec={{}}
                ref={ref}
                xml="<xml />"
            />,
        );
        expect(ref.current?.getXml()).toBe(undefined);
    });

    test('click should hide bubble', async () => {
        const {
            container,
            getByLabelText,
            getByText,
            queryByLabelText,
        } = render(
            <XmlEditor
                docSpec={{
                    elements: {
                        xml: {
                            attributes: {
                                foo: {
                                    asker: Util.askString,
                                },
                            },
                        },
                    },
                }}
                ref={React.createRef()}
                xml='<xml foo="bar" />'
            />,
        );
        await waitFor(() => getByText('bar'));
        fireEvent.click(getByText('bar'));
        // bubble open
        expect(getByLabelText('Value')).toBeTruthy();
        fireEvent.click(container.firstChild as any);
        // bubble closed
        expect(queryByLabelText('Value')).not.toBeTruthy();
    });

    test('Change xml should call onChange handler', async () => {
        const onChange = jest.fn();
        const { getByDisplayValue, getByText } = render(
            <XmlEditor
                docSpec={{
                    elements: {
                        xml: {
                            attributes: {
                                foo: {
                                    asker: Util.askString,
                                },
                            },
                        },
                    },
                }}
                onChange={onChange}
                ref={React.createRef()}
                xml='<xml foo="bar" />'
            />,
        );
        await waitFor(() => getByText('bar'));
        fireEvent.click(getByText('bar'));
        fireEvent.click(getByDisplayValue('OK'));
        expect(onChange).toBeCalled();
    });
});
