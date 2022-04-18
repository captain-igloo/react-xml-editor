import * as React from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';

const root = createRoot(document.getElementById('app'));

if (root) {
    root.render(<App />);
}
