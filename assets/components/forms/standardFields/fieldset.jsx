// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';


// ----- Types ----- //

type PropTypes = {
  children: Node,
};


// ----- Component ----- //

function Fieldset({ children, ...otherProps }: PropTypes) {
  return (
    <fieldset className="component-fieldset" {...otherProps}>
      {children}
    </fieldset>
  );
}


// ----- Exports ----- //

export { Fieldset };
