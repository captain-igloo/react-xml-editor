# react-xml-editor

React XML Editor, inspired by [xonomy](https://github.com/michmech/xonomy).

## Installation

    $ npm install --save react-xml-editor

Render the XmlEditor component, passing in the initial XML as a string and an appropriate document specification:

```js
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as ReactXmlEditor from 'react-xml-editor';

ReactDOM.render(
    <ReactXmlEditor.XmlEditor
        docSpec={ /* see demo directory for a full example */ }
        xml={'<list><item label="one">text 1</item><item label="two">text 2</item></list>'}
    />,
    document.getElementById('app')
);
```

## Contact

colindoig [at] gmail [dot] com
