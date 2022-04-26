import * as builder from 'xmlbuilder';

import { Xml } from './types';

export interface BuilderOptions {
    doctype?: {
        pubID?: string;
        sysID?: string;
    };
    headless?: boolean;
    renderOpts?: {

    };
    xmldec?: {
        encoding?: string;
        standalone?: boolean;
        version?: '1.0';
    };
}

export default class Builder {
    private attrKey = '$';

    private charKey = '_';

    private childKey = '$$';

    private textKey = '__text__';

    private headless: boolean;

    private xmldec: {
        encoding?: string;
        standalone?: boolean;
        version?: string;
    };

    private doctype?: {
        pubID?: string;
        sysID?: string;
    };

    public constructor(options: BuilderOptions) {
        this.headless = options.headless || false;
        this.xmldec = options.xmldec || {
            encoding: 'UTF-8',
            standalone: true,
            version: '1.0',
        };
        this.doctype = options.doctype;
    }

    public buildObject(rootObj: Xml): string {
        let rootName;

        if (Object.keys(rootObj).length === 1) {
            rootName = Object.keys(rootObj)[0];
        } else {
            throw new Error('invalid');
        }

        const rootElement = builder.create(rootName, this.xmldec, this.doctype, {
            headless: this.headless,
        });

        return this.render(rootElement, rootObj[rootName]).end({
            indent: '  ',
            newline: '\n',
            pretty: true,
        });
    }

    private render(element: any, obj: any) {
        if (Array.isArray(obj)) {
            obj.forEach((child) => {
                if ('#name' in child) {
                    if (child['#name'] === this.textKey) {
                        element = element.txt(child[this.charKey]);
                    } else {
                        element = this.render(element.ele(child['#name']), child).up();
                    }
                }
            });
        } else {
            if (this.attrKey in obj) {
                const child = obj[this.attrKey];
                Object.keys(child).forEach((attr) => {
                    const value = child[attr];
                    element = element.att(attr, value);
                });
            }
            if (this.childKey in obj) {
                const child = obj[this.childKey];
                if (Array.isArray(child)) {
                    element = this.render(element, child);
                }
            }
        }
        return element;
    }
}
