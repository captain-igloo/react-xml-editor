import * as React from 'react';

import Attribute from './Attribute';
import { Actions } from './types';
import { push } from './Util';

interface Props {
    actions: Actions;
    attributes: {[key: string]: string};
    id: string[];
    element: string;
}

export default class Attributes extends React.Component<Props> {
    public render(): React.ReactNode {
        const { actions, attributes, element, id } = this.props;
        return (
            <span className="attributes">
                { Object.keys(attributes).map((name: string) => (
                    <Attribute
                        actions={ actions }
                        element={ element }
                        id={ push(id, '$', name) }
                        key={ name }
                        name={ name }
                        value={ this.props.attributes[name] }
                    />
                )) }
            </span>
        );
    }
}
