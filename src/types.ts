export interface IMenuItemSpec {
    action: any;
    actionParameter?: any;
    caption: string;
}

export interface IAttributeSpec {
    asker?: (options: IAskerOptions) => React.ReactNode;
    menu?: IMenuItemSpec[];
}

export interface IElementsSpec {
    attributes: {[key: string]: IAttributeSpec};
    menu?: IMenuItemSpec[];
}

export interface IDocSpec {
    elements?: {[key: string]: IElementsSpec};
}

export interface IXml {
    [key: string]: IElement;
}

export enum EBubbleType {
    ASKER,
    MENU,
}

export interface IBubbleOptions {
    // actions: IActions;
    attribute: string;
    element: string;
    id: string;
    left: number;
    show: boolean;
    type: EBubbleType;
    top: number;
    value: string;
}

export interface IActions {
    setXml: (xml: IXml) => void;
    showBubble: (askOptions: Partial<IBubbleOptions>) => void;
    // updateNode: (xml: IXml, id: string, value: string | boolean) => void;
}

export interface IAskerOptions {
    actions: IActions;
    defaultValue: string;
    id: string;
    xml: IXml;
}

export interface IElement {
    _?: string;
    $?: {[key: string]: string};
    $$?: IElement[];
    '#collapsed'?: boolean;
    '#name': string;
}

export type TAsker = (options: IAskerOptions) => React.ReactNode;
