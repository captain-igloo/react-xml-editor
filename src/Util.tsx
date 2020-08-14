import * as React from 'react';

import AskString, { AskStringType } from './AskString';
import Parser from './Parser';
import {
    AskerOptions,
    Element,
    MenuItemSpecNoParameter,
    MenuItemSpecWithParameter,
    Xml,
} from './types';

export const updateNode = (xml: Xml, id: string, value: string | boolean) => {
    return modifyXml(id.split('~'), xml, () => {
        return value;
    });
};

export const newElementChild = async (xml: Xml, id: string, actionParameter: string): Promise<Xml> => {
    const parser = new Parser();
    const child = await parser.parseString(actionParameter);
    return modifyXml(id.split('~'), xml, (parent) => {
        if (!parent.$$) {
            parent.$$ = [];
        }
        parent.$$.push(child[Object.keys(child)[0]]);
        return parent;
    });
};

export const hasActionParameter = (
    menuItemSpec: MenuItemSpecWithParameter<any> | MenuItemSpecNoParameter
): menuItemSpec is MenuItemSpecWithParameter<any> => {
    return (menuItemSpec as MenuItemSpecWithParameter<any>).actionParameter !== undefined;
}

const newElementSibling = async (xml: Xml, id: string, actionParameter: string, indexDelta: number) => {
    const parser = new Parser();
    const element = await parser.parseString(actionParameter);
    const elementId = id.split('~');
    const arrayIndex = parseInt(elementId.splice(-1, 1)[0], 10);
    if (!isNaN(arrayIndex)) {
        return modifyXml(elementId, xml, (parent) => {
            if (Array.isArray(parent)) {
                parent.splice(arrayIndex + indexDelta, 0, element[Object.keys(element)[0]]);
            }
            return parent;
        });
    }
    throw new Error(`Invalid id: ${id}`);
};

export const newElementBefore = (xml: Xml, id: string, actionParameter: string) => {
    return newElementSibling(xml, id, actionParameter, 0);
};

export const newElementAfter = async (xml: Xml, id: string, actionParameter: string) => {
    return newElementSibling(xml, id, actionParameter, 1);
};

export const newAttribute = (xml: Xml, id: string, actionParameter: {name: string; value: string}) => {
    return modifyXml(id.split('~'), xml, (parent) => {
        if (!parent.$) {
            parent.$ = {};
        }
        parent.$[actionParameter.name] = actionParameter.value;
        return parent;
    });
};

export const deleteElement = (xml: Xml, id: string) => {
    return deleteNode(xml, id);
};

export const deleteAttribute = (xml: Xml, id: string) => {
    return deleteNode(xml, id);
};

export const deleteNode = (xml: Xml, id: string) => {
    const nodeId = id.split('~');
    const nodeKey = nodeId.splice(-1, 1);
    return modifyXml(nodeId, xml, (parent) => {
        delete (parent as any)[nodeKey[0]];
        return parent;
    });
};

const modifyXml = (id: string[], xml: any, modifier: (xml: Element) => any): Xml => {
    if (id.length > 1) {
        const first = id.splice(0, 1);
        xml[first[0]] = modifyXml(id, xml[first[0]], modifier);
        return xml;
    }
    xml[id[0]] = modifier(xml[id[0]]);
    return xml;
};

export const getXmlNode = (id: string[], xml: any): any => {
    if (id.length > 1) {
        const first = id.splice(0, 1);
        return getXmlNode(id, xml[first[0]]);
    }
    return xml[id[0]];
};

export const askString = (options: AskerOptions) => {
    return (
        <AskString
            actions={ options.actions }
            defaultValue={ options.defaultValue }
            id={ options.id }
            type={ AskStringType.SHORT }
            xml={ options.xml }
        />
    );
};

export const askLongString = (options: AskerOptions) => {
    return (
        <AskString
            actions={ options.actions }
            defaultValue={ options.defaultValue }
            id={ options.id }
            type={ AskStringType.LONG }
            xml={ options.xml }
        />
    );
}
