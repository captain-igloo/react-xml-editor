import * as React from 'react';

import { Actions, Xml } from './types';
import { updateNode } from './Util';

export enum AskStringType {
    LONG,
    SHORT,
}

interface Props {
    actions: Actions;
    defaultValue: string;
    id: string[];
    type: AskStringType;
    xml: Xml;
}

interface State {
    value: string;
}

export default class AskString extends React.Component<Props, State> {
    public constructor(props: Props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.state = {
            value: props.defaultValue,
        };
    }

    public render(): React.ReactNode {
        const { type } = this.props;
        return (
            <form onSubmit={ this.onSubmit }>
                { type === AskStringType.LONG ? this.getLongString() : this.getShortString() }
            </form>
        );
    }

    private getShortString(): React.ReactNode {
        const { value } = this.state;

        return (
            <>
                <input
                    aria-label="Value"
                    name="val"
                    className="textbox focusme"
                    onChange={ this.onChange }
                    value={ value }
                />
                <input type="submit" value="OK"/>
            </>
        );
    }

    private getLongString(): React.ReactNode {
        const { value } = this.state;
        return (
            <>
                <textarea
                    name="val"
                    className="textbox focusme"
                    onChange={ this.onChange }
                    value={value}
                />
                <div className="submitline">
                    <input type="submit" value="OK" />
                </div>
            </>
        );
    }

    private onSubmit(e: React.FormEvent<HTMLFormElement>) {
        const { actions, id, xml } = this.props;
        const { value } = this.state;

        actions.setXml(updateNode(xml, id, value));
        actions.showBubble({
            show: false,
        });
        e.preventDefault();
    }

    private onChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        this.setState({
            value: e.target.value,
        });
    }
}
