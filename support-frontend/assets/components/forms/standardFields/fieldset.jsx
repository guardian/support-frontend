// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';
import { type Option } from 'helpers/types/option';


// ----- Component ----- //

function Fieldset({ children, legend, ...props }: {children: Node, legend: Option<string>}) {
  return (
    <fieldset className="component-fieldset" {...props} >
      <legend className="accessibility-hint">{legend}</legend>
      {children}
    </fieldset>);
}


// ----- Exports ----- //

export { Fieldset };
