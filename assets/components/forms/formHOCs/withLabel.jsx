// @flow

// ----- Imports ----- //

import React from 'react';


// ----- Component ----- //

function withLabel(text: string) {
  return function HOC<Props: { id: string }>(Component: React$ComponentType<Props>): React$ComponentType<Props> {
    return (props: Props) => (
      <div>
        <label className="component-label" htmlFor={props.id}>{text}</label>
        <Component {...props} />
      </div>
    );
  };
}


// ----- Exports ----- //

export { withLabel };
