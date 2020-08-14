import * as xml2js from 'xml2js';

import { Xml } from './types';

export default class Parser {
    private parser: xml2js.Parser;

    public constructor() {
        this.parser = new xml2js.Parser({
            charsAsChildren: true,
            explicitChildren: true,
            preserveChildrenOrder: true,
        });
    }

    public parseString(xml: string): Promise<Xml> {
        return this.parser.parseStringPromise(xml);
    }
}
