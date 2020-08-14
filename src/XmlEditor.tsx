import * as React from 'react';

import Bubble from './Bubble';
import Element from './Element';
import Parser from './Parser';
import { BubbleType, Actions, BubbleOptions, DocSpec, Xml } from './types';

interface Props {
    docSpec: DocSpec;
    ref: React.RefObject<XmlEditor>;
    xml: string;
}

interface State {
    bubble: BubbleOptions;
    xml?: Xml;
}

export default class XmlEditor extends React.Component<Props, State> {
    public constructor(props: Props) {
        super(props);
        this.setXml = this.setXml.bind(this);
        this.showBubble = this.showBubble.bind(this);
        this.state = {
            bubble: {
                attribute: '',
                element: '',
                id: '',
                left: 0,
                show: false,
                top: 0,
                type: BubbleType.ASKER,
                value: '',
            },
        };
    }

    public componentDidMount() {
        const { xml } = this.props;
        const parser = new Parser();
        parser.parseString(xml).then((result) => {
            this.setState({
                xml: result,
            });
        });
    }

    public render(): React.ReactNode {
        return (
            <React.Fragment>
                <div className="xonomy nerd">
                    { this.getRootNode() }
                </div>
                { this.getBubble() }
            </React.Fragment>
        );
    }

    public getXml() {
        return this.state.xml;
    }

    private setXml(xml: Xml) {
        this.setState({
            xml,
        });
    }

    private showBubble(askOptions: Partial<BubbleOptions>): void {
        this.setState((prevState: State) => ({
            bubble: Object.assign(prevState.bubble, askOptions),
        }));
    }

    private getActions(): Actions {
        return {
            setXml: this.setXml,
            showBubble: this.showBubble,
        };
    }

    private getBubble(): React.ReactNode {
        const { docSpec } = this.props;
        const { bubble, xml} = this.state;
        if (xml) {
            return (
                <Bubble
                    actions={ this.getActions() }
                    attribute={ bubble.attribute }
                    docSpec={ docSpec }
                    element={ bubble.element }
                    id={ bubble.id }
                    left={ bubble.left }
                    show={ bubble.show }
                    top={ bubble.top }
                    type={ bubble.type }
                    value={ bubble.value }
                    xml={ xml }
                />
            );
        }
        return null;
    }

    private getRootNode(): React.ReactNode {
        const { xml } = this.state;
        if (xml) {
            const key = Object.keys(xml)[0];
            return (
                <Element
                    actions={ this.getActions() }
                    attributes={ xml[key].$ }
                    childElements={ xml[key].$$ }
                    collapsed={ xml[key]['#collapsed'] }
                    id={ `${key}` }
                    name={ key }
                    xml={ xml }
                />
            );
        }
        return null;
    }
}
