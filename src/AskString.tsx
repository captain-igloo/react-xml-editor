import * as React from 'react';

import { IActions, IXml } from './types';
import { updateNode } from './Util';

export enum EAskStringType {
    LONG,
    SHORT,
}

interface IProps {
    actions: IActions;
    defaultValue: string;
    id: string;
    type: EAskStringType;
    xml: IXml;
}

interface IState {
    value: string;
}

export default class AskString extends React.Component<IProps, IState> {
    public constructor(props: IProps) {
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
                { type === EAskStringType.LONG ? this.getLongString() : this.getShortString() }
            </form>
        );
    }

    private getShortString(): React.ReactNode {
        const { value } = this.state;

        return (
            <>
                <input
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
