import * as xml2js from 'xml2js';

import { IXml } from './types';

export interface IElement {
    _?: string;
    $?: {[key: string]: string};
    $$?: IElement[];
    '#collapsed'?: boolean;
    '#name': string;
}

export default class Parser {
    private parser: xml2js.Parser;

    public constructor() {
        this.parser = new xml2js.Parser({
            charsAsChildren: true,
            explicitChildren: true,
            preserveChildrenOrder: true,
        });
    }

    public parseString(xml: string): Promise<IXml> {
        return this.parser.parseStringPromise(xml);
    }
}
