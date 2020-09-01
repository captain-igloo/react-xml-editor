export interface MenuItemSpec {
    action: (xml: Xml, id: string[]) => Xml | Promise<Xml>;
    caption: string;
    hideIf?: (a: any) => boolean;
}

export type Asker = (options: AskerOptions) => React.ReactNode;

export interface AskPicklistCaptionMenuItem {
    caption: string;
    value: string
};

export type AskPicklistMenuItem = AskPicklistCaptionMenuItem | string;

export type AskerParameter = AskPicklistMenuItem[];
export interface AttributeSpec {
    asker?: Asker;
    menu?: MenuItemSpec[];
}

export interface ElementsSpec {
    asker?: Asker;
    attributes?: {[key: string]: AttributeSpec};
    menu?: MenuItemSpec[];
}

export interface DocSpec {
    elements?: {[key: string]: ElementsSpec};
}

export interface Xml {
    [key: string]: Element;
}

export enum BubbleType {
    ASKER,
    MENU,
}

export interface BubbleOptions {
    attribute: string;
    element: string;
    id: string[];
    left: number;
    show: boolean;
    type: BubbleType;
    top: number;
    value: string;
}

export interface Actions {
    setXml: (xml: Xml) => void;
    showBubble: (askOptions: Partial<BubbleOptions>) => void;
}

export interface AskerOptions {
    actions: Actions;
    defaultValue: string;
    id: string[];
    parameter?: AskerParameter;
    xml: Xml;
}

export interface Element {
    _?: string;
    $?: {[key: string]: string};
    $$?: Element[];
    '#collapsed'?: boolean;
    '#name': string;
}
