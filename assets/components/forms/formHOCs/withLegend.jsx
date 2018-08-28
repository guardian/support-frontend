// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';


// ----- Component ----- //

function withLegend(text: string) {
  return function HOC<Props: { children: Node }>(Component: React$ComponentType<Props>): React$ComponentType<Props> {
    return (props: Props) => (
      <Component {...props}>
        <legend className="component-legend">{text}</legend>
        {props.children}
      </Component>
    );
  };
}


// ----- Exports ----- //

export { withLegend };
