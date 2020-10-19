import * as React from 'react';

import Bubble from './Bubble';
import Element from './Element';
import Parser from './Parser';
import { BubbleType, Actions, BubbleOptions, DocSpec, Xml } from './types';

type DefaultProps = {
    mode: 'laic' | 'nerd';
}

type Props = {
    docSpec: DocSpec;
    ref: React.RefObject<XmlEditor>;
    xml: string;
} & Partial<DefaultProps>;

interface State {
    bubble: BubbleOptions;
    xml?: Xml;
}

export default class XmlEditor extends React.Component<Props & DefaultProps, State> {
    static defaultProps: DefaultProps = {
        mode: 'nerd',
    };

    public constructor(props: Props & DefaultProps) {
        super(props);
        this.setXml = this.setXml.bind(this);
        this.showBubble = this.showBubble.bind(this);
        this.onClick = this.onClick.bind(this);
        this.state = {
            bubble: {
                attribute: '',
                element: '',
                id: [],
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
        const { mode } = this.props;
        return (
            <React.Fragment>
                <div className={`xonomy ${mode}`} onClick={ this.onClick }>
                    { this.getRootNode() }
                </div>
                { this.getBubble() }
            </React.Fragment>
        );
    }

    public getXml() {
        return this.state.xml;
    }

    private onClick() {
        this.showBubble({
            show: false,
        });
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
        const { docSpec, mode } = this.props;
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
                    mode={ mode }
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
                    id={ [key] }
                    name={ key }
                    xml={ xml }
                />
            );
        }
        return null;
    }
}
