import * as React from 'react';

import Attribute from './Attribute';
import { IActions } from './types';

interface IProps {
    actions: IActions;
    attributes: {[key: string]: string};
    id: string;
    element: string;
}

export default class Attributes extends React.Component<IProps> {
    public render(): React.ReactNode {
        const { actions, attributes, element, id } = this.props;
        return (
            <span className="attributes">
                { Object.keys(attributes).map((name: string) => (
                    <Attribute
                        actions={ actions }
                        element={ element }
                        id={ `${id}~\$~${name}` }
                        key={ name }
                        name={ name }
                        value={ this.props.attributes[name] }
                    />
                )) }
            </span>
        );
    }
}
