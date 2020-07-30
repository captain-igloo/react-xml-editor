import * as React from 'react';
import * as ReactDOM from 'react-dom';

import XmlEditor from '../lib/XmlEditor';
import {
    askString,
    newAttribute,
    newElementChild,
    deleteAttribute,
} from '../lib/Util';

ReactDOM.render(
    <XmlEditor
        docSpec={{
            elements: {
                item: {
                    attributes: {
                        label: {
                            asker: askString,
                            menu: [{
                                action: deleteAttribute,
                                caption: 'Delete attribute',
                            }],
                        },
                    },
                    menu: [{
                        action: newElementChild,
                        actionParameter: '<child />',
                        caption: 'Append child <child />',
                    },{
                        action: newAttribute,
                        actionParameter: {
                            name: 'label',
                            value: 'default value',
                        },
                        caption: 'Add attribute "label"',
                    }]
                },
            }
        }}
        xml={'<list><item label="one">text 1</item><item label="two">text 2</item></list>'}
    />,
    document.getElementById('app')
);
