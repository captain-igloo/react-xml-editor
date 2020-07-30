/* import { JSDOM } from 'jsdom';

const jsdom = new JSDOM('<!doctype html><html><body></body></html>');
const { window } = jsdom;

function copyProps(src: any, target: any) {
    Object.defineProperties(target, {
        ...Object.getOwnPropertyDescriptors(src),
        ...Object.getOwnPropertyDescriptors(target),
    });
}

(global as any).window = window;
global.document = window.document;
(global as any).navigator = {
    userAgent: 'node.js',
};
(global as any).requestAnimationFrame = function (callback: any) {
    return setTimeout(callback, 0);
};
global.cancelAnimationFrame = function (id) {
    clearTimeout(id);
};
copyProps(window, global);
 */