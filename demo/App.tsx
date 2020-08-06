import * as React from 'react';

import XmlEditor from '../lib/XmlEditor';
import * as Util from '../lib/Util';
import Builder from '../lib/Builder';

const docSpec = {
    elements: {
        item: {
            attributes: {
                label: {
                    asker: Util.askString,
                    menu: [{
                        action: Util.deleteAttribute,
                        caption: 'Delete attribute',
                    }],
                },
            },
            menu: [{
                action: Util.newElementChild,
                actionParameter: '<child />',
                caption: 'Append child <child />',
            },{
                action: Util.newAttribute,
                actionParameter: {
                    name: 'label',
                    value: 'default value',
                },
                caption: 'Add attribute "label"',
            },{
                action: Util.deleteElement,
                caption: 'Delete this <item />',
            },{
                action: Util.newElementBefore,
                caption: 'New <item /> before this',
                actionParameter: '<item />',
            },
            {
                action: Util.newElementAfter,
                caption: 'New <item /> after this',
                actionParameter: '<item />',
            }]
        },
    }
};

const xml = '<list><item label="one">text 1</item><item label="two">text 2</item></list>';

export default class App extends React.Component<{}, {xml: string}> {
    private ref: React.RefObject<XmlEditor>;

    public constructor(props: {}) {
        super(props);
        this.ref = React.createRef();
        this.onClickHarvest = this.onClickHarvest.bind(this);
        this.state = {
            xml: '',
        };
    }

    public render(): React.ReactNode {
        return (
            <>
                <div>
                    <XmlEditor
                        docSpec={ docSpec }
                        ref={ this.ref }
                        xml={ xml }
                    />
                    <button onClick={ this.onClickHarvest }>
                        Harvest
                    </button>
                </div>
                <div>
                    <pre>
                        { this.state.xml }
                    </pre>
                </div>
            </>
        );
    }

    private onClickHarvest(): void {
        if (this.ref.current) {
            const builder = new Builder({});
            const xml = this.ref.current.getXml();
            if (xml) {
                this.setState({
                    xml: builder.buildObject(xml),
                });
            }
        }
    }
}
