import * as React from 'react';

import Bubble from './Bubble';
import Element from './Element';
import Parser from './Parser';
import { EBubbleType, IActions, IBubbleOptions, IDocSpec, IXml } from './types';

interface IProps {
    docSpec: IDocSpec;
    xml: string;
}

interface IState {
    bubble: IBubbleOptions;
    xml?: IXml;
}

export default class XmlEditor extends React.Component<IProps, IState> {
    public constructor(props: IProps) {
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
                type: EBubbleType.ASKER,
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

    private setXml(xml: IXml) {
        this.setState({
            xml,
        });
    }

    private showBubble(askOptions: Partial<IBubbleOptions>): void {
        this.setState((prevState: IState) => ({
            bubble: Object.assign(prevState.bubble, askOptions),
        }));
    }

    private getActions(): IActions {
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
