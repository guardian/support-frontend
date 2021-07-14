/* eslint-disable @typescript-eslint/no-explicit-any */
import ReactDOM from 'react-dom';
import { VNode } from 'preact';
import ProductOptionGroup from './pages/weekly/components/content/productOptionGroup';
import React from 'react';

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
    ProductOptionGroup,
};
const $componentMarkers = document.querySelectorAll(`[data-cmp-id]`);

Array.from($componentMarkers).forEach(($marker) => {
    const cmpId = ($marker as HTMLElement).dataset.cmpId;
    if (cmpId) {
        const $component = $marker.nextElementSibling as HTMLElement;
        console.log($marker, $component);
        const { name, props } = window.__STATE__.components[cmpId] as ComponentDataType;
        const Component = componentMap[name];

        if (Component) {
            ReactDOM.render(<Component {...props} />, $component.parentNode as HTMLElement);
        }
    }
});
