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
    return modifyXml(id, xml, () => {
        return value;
    });
};

export const newElementChild = (parameter: string) => async (xml: Xml, id: string[]): Promise<Xml> => {
    const parser = new Parser();
    const child = await parser.parseString(parameter);
    return modifyXml(id, xml, (parent) => {
        if (!parent.$$) {
            parent.$$ = [];
        }
        parent.$$.push(child[Object.keys(child)[0]]);
        return parent;
    });
};

const newElementSibling = async (xml: Xml, id: string[], sibling: string, indexDelta: number) => {
    const parser = new Parser();
    const element = await parser.parseString(sibling);
    const idClone = id.slice(0);
    const arrayIndex = parseInt(idClone.splice(-1, 1)[0], 10);
    if (!isNaN(arrayIndex)) {
        return modifyXml(idClone, xml, (parent) => {
            if (Array.isArray(parent)) {
                parent.splice(arrayIndex + indexDelta, 0, element[Object.keys(element)[0]]);
            }
            return parent;
        });
    }
    throw new Error(`Invalid id: ${id}`);
};

export const newElementBefore = (parameter: string) =>
    (xml: Xml, id: string[]) =>
        newElementSibling(xml, id, parameter, 0);

export const newElementAfter = (parameter: string) =>
    (xml: Xml, id: string[]) =>
        newElementSibling(xml, id, parameter, 1);

export const newAttribute = (parameter: {name: string; value: string}) =>
    (xml: Xml, id: string[]) =>
        modifyXml(id, xml, (parent) => {
            if (!parent.$) {
                parent.$ = {};
            }
            parent.$[parameter.name] = parameter.value;
            return parent;
        });

export const deleteElement = (xml: Xml, id: string[]) => {
    return deleteNode(xml, id);
};

export const deleteAttribute = (xml: Xml, id: string[]) => {
    return deleteNode(xml, id);
};

export const deleteNode = (xml: Xml, id: string[]) => {
    const idClone = id.slice(0);
    const nodeKey = idClone.splice(-1, 1);
    return modifyXml(idClone, xml, (parent) => {
        delete (parent as any)[nodeKey[0]];
        return parent;
    });
};

const modifyXml = (id: string[], xml: any, modifier: (xml: Element) => any): Xml => {
    if (id.length > 1) {
        const idClone = id.slice(0);
        const first = idClone.splice(0, 1);
        xml[first[0]] = modifyXml(idClone, xml[first[0]], modifier);
        return xml;
    }
    xml[id[0]] = modifier(xml[id[0]]);
    return xml;
};

export const getXmlNode = (id: string[], xml: any): any => {
    if (id.length > 1) {
        const idClone = id.slice(0);
        const first = idClone.splice(0, 1);
        return getXmlNode(idClone, xml[first[0]]);
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
