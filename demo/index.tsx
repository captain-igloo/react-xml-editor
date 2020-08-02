import * as React from 'react';
import * as ReactDOM from 'react-dom';

import XmlEditor from '../lib/XmlEditor';
import {
    askString,
    deleteElement,
    newAttribute,
    newElementAfter,
    newElementBefore,
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
                    },{
                        action: deleteElement,
                        caption: 'Delete this <item />',
                    },{
                        action: newElementBefore,
                        caption: 'New <item /> before this',
                        actionParameter: '<item />',
                    },
                    {
                        action: newElementAfter,
                        caption: 'New <item /> after this',
                        actionParameter: '<item />',
                    }]
                },
            }
        }}
        xml={'<list><item label="one">text 1</item><item label="two">text 2</item></list>'}
    />,
    document.getElementById('app')
);
