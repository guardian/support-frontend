/* eslint-disable @typescript-eslint/no-explicit-any */
import { html, render } from 'htm/preact';
import { VNode } from 'preact';

import ProductOption from './components/product/productOption';

type ComponentDataType = {
    name: string;
    props: any;
};

declare global {
    interface Window {
        __STATE__: {
            components: Record<string, ComponentDataType>;
        };
    }
}

const componentMap: Record<string, (props: any) => VNode> = {
    ProductOption,
};
const $componentMarkers = document.querySelectorAll(`[data-cmp-id]`);

console.log($componentMarkers);

Array.from($componentMarkers).forEach(($marker) => {
    const cmpId = ($marker as HTMLElement).dataset.cmpId;
    if (cmpId) {
        const $component = $marker.nextElementSibling as HTMLElement;
        const { name, props } = window.__STATE__.components[cmpId] as ComponentDataType;
        const Component = componentMap[name];

        render(html`<${Component} ...${props} />`, $component.parentNode as HTMLElement);
    }
});
