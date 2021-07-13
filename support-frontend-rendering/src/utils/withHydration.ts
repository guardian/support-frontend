import React from 'react';
import { html } from 'htm/react';

let id = 0;

export default function withHydration<T>(
    Component: React.FunctionComponent<T>,
): (props: T) => React.ReactElement {
    return function withPropHydration(props: T) {
        id += 1;
        const preRender = typeof window === 'undefined';

        const scriptSrc = `
    window.__STATE__.components[${id}]={name:${JSON.stringify(
            Component.name,
        )},props:${JSON.stringify(props)}}
  `;

        return html`
            ${preRender &&
            html`<script
                dangerouslySetInnerHTML=${{ __html: scriptSrc }}
                data-cmp-id=${id}
            ></script>`}
            <${Component} data-prerender-id=${id} ...${props} />
        `;
    };
}
