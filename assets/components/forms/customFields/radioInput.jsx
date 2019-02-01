// @flow

// ----- Imports ----- //

import * as React from 'react';


// ----- Types ----- //

type PropTypes = {
  text: string | React.Node,
};


// ----- Component ----- //

function RadioInput({ text, ...otherProps }: PropTypes) {

  return (
    <label className="component-radio-input">
      <input className="component-radio-input__input" type="radio" {...otherProps} />
      <span className="component-radio-input__text">{text}</span>
    </label>
  );

}


// ----- Exports ----- //

export { RadioInput };
