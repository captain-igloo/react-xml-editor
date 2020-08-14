interface MenuItemSpecBase {
    caption: string;
    hideIf?: (a: any) => boolean;
}

export interface MenuItemSpecWithParameter<T> extends MenuItemSpecBase {
    action: (xml: Xml, id: string, actionParameter: T) => Xml | Promise<Xml>;
    actionParameter: T;
}

export interface MenuItemSpecNoParameter extends MenuItemSpecBase {
    action: (xml: Xml, id: string) => Xml | Promise<Xml>;
}

export type MenuItemSpecGeneric<T> = MenuItemSpecWithParameter<T> | MenuItemSpecNoParameter;

export type MenuItemSpec = MenuItemSpecGeneric<string> | MenuItemSpecGeneric<{name: string; value: string}>;

export interface AttributeSpec {
    asker?: (options: AskerOptions) => React.ReactNode;
    menu?: MenuItemSpec[];
}

export interface ElementsSpec {
    attributes: {[key: string]: AttributeSpec};
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
    id: string;
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
    id: string;
    xml: Xml;
}

export interface Element {
    _?: string;
    $?: {[key: string]: string};
    $$?: Element[];
    '#collapsed'?: boolean;
    '#name': string;
}
