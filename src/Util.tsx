import * as React from 'react';

import AskPicklist from './AskPicklist';
import AskString, { AskStringType } from './AskString';
import Parser from './Parser';
import {
    AskerOptions,
    AskerParameter,
    Element,
    Xml,
} from './types';

export const updateNode = (xml: Xml, id: string[], value: string | boolean) => {
    return modifyXml(xml, id, () => {
        return value;
    });
};

export const newElementChild = (parameter: string) => async (xml: Xml, id: string[]): Promise<Xml> => {
    const parser = new Parser();
    const child = await parser.parseString(parameter);
    return modifyXml(xml, id, (parent) => {
        if (!parent.$$) {
            parent.$$ = [];
        }
        parent.$$.push(child[Object.keys(child)[0]]);
        return parent;
    });
};

export const newTextChild = (parameter: string) => async (xml: Xml, id: string[]): Promise<Xml> => {
    return modifyXml(xml, id, (parent) => {
        if (!parent.$$) {
            parent.$$ = [];
        }
        parent.$$.push({
            '#name': '__text__',
            _: parameter,
        });
        return parent;
    });
};

const newElementSibling = async (xml: Xml, id: string[], sibling: string, indexDelta: number) => {
    const parser = new Parser();
    const element = await parser.parseString(sibling);
    return modifyElement(xml, id, (parent, arrayIndex) => {
        parent.splice(arrayIndex + indexDelta, 0, element[Object.keys(element)[0]]);
        return parent;
    });
};

export const newElementBefore = (parameter: string) =>
    (xml: Xml, id: string[]) =>
        newElementSibling(xml, id, parameter, 0);

export const newElementAfter = (parameter: string) =>
    (xml: Xml, id: string[]) =>
        newElementSibling(xml, id, parameter, 1);

const modifyElement = (xml: Xml, id: string[], modifier: (xml: Element[], arrayIndex: number) => Element[]) => {
    const idClone = id.slice(0);
    const arrayIndex = parseInt(idClone.splice(-1, 1)[0], 10);
    if (!isNaN(arrayIndex)) {
        return modifyXml(xml, idClone, (parent) => {
            if (Array.isArray(parent)) {
                return modifier(parent, arrayIndex);
            }
            throw new Error(`Failed to find node: ${id}`);
        });
    }
    throw new Error(`Invalid id: ${id}`);
};

export const duplicateElement = (xml: Xml, id: string[]) =>
    modifyElement(xml, id, (parent: Element[], arrayIndex: number) => {
        parent.splice(arrayIndex + 1, 0, Object.assign({}, parent[arrayIndex]));
        return parent;
    });

const swap = (arr: Element[], index1: number, index2: number) => {
    const temp = arr[index1];
    arr[index1] = arr[index2];
    arr[index2] = temp;
};

export const moveElementUp = (xml: Xml, id: string[]) =>
    modifyElement(xml, id, (parent: Element[], arrayIndex) => {
        if (arrayIndex > 0) {
            swap(parent, arrayIndex - 1, arrayIndex);
        }
        return parent;
    });

export const canMoveElementUp = (xml: Xml, id: string[]): boolean => {
    if (id.length > 0) {
        return parseInt(id[id.length - 1], 10) > 0;
    }
    return false;
};

export const canMoveElementDown = (xml: Xml, id: string[]): boolean => {
    const idClone = id.slice(0);
    idClone.splice(-1, 1);
    const parent = getXmlNode(xml, idClone);
    return Array.isArray(parent) &&
        id.length > 0 &&
        parent.length - 1 > parseInt(id[id.length - 1], 10);
};

export const moveElementDown = (xml: Xml, id: string[]) =>
    modifyElement(xml, id, (parent: Element[], arrayIndex) => {
        if (arrayIndex < parent.length - 1) {
            swap(parent, arrayIndex + 1, arrayIndex);
        }
        return parent;
    });

export const newAttribute = (parameter: {name: string; value: string}) =>
    (xml: Xml, id: string[]) =>
        modifyXml(xml, id, (parent) => {
            if (!parent.$) {
                parent.$ = {};
            }
            parent.$[parameter.name] = parameter.value;
            return parent;
        });

export const deleteElement = (xml: Xml, id: string[]) => {
    return deleteNode(xml, id);
};

export const deleteAttribute = (xml: Xml, id: string[]) => deleteNode(xml, id);

export const deleteNode = (xml: Xml, id: string[]) => {
    const idClone = id.slice(0);
    const nodeKey = idClone.splice(-1, 1);
    return modifyXml(xml, idClone, (parent) => {
        if (Array.isArray(parent)) {
            parent.splice(parseInt(nodeKey[0], 10), 1);
        } else {
            delete (parent as any)[nodeKey[0]];
        }
        return parent;
    });
};

export const modifyXml = (xml: any, id: string[], modifier: (xml: Element) => any): Xml => {
    if (id.length > 1) {
        const idClone = id.slice(0);
        const first = idClone.splice(0, 1);
        xml[first[0]] = modifyXml(xml[first[0]], idClone, modifier);
        return xml;
    }
    xml[id[0]] = modifier(xml[id[0]]);
    return xml;
};

export const getXmlNode = (xml: any, id: string[]): any => {
    if (id.length > 1) {
        const idClone = id.slice(0);
        const first = idClone.splice(0, 1);
        return getXmlNode(xml[first[0]], idClone);
    }
    return xml[id[0]];
};

export const push = (arr: string[], ...newValues: string[]): string[] => {
    const clone = arr.slice(0);
    clone.push(...newValues);
    return clone;
};

export const askPicklist = (parameter: AskerParameter) => (options: AskerOptions) => (
    <AskPicklist
        actions={ options.actions }
        id={ options.id }
        parameter={ parameter }
        xml={ options.xml }
    />
);

export const askString = (options: AskerOptions) => (
    <AskString
        actions={ options.actions }
        defaultValue={ options.defaultValue }
        id={ options.id }
        type={ AskStringType.SHORT }
        xml={ options.xml }
    />
);

export const askLongString = (options: AskerOptions) => (
    <AskString
        actions={ options.actions }
        defaultValue={ options.defaultValue }
        id={ options.id }
        type={ AskStringType.LONG }
        xml={ options.xml }
    />
);
