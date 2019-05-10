// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';

import './checkbox.scss';

// ----- Types ----- //

type PropTypes = {
  text: Node,
};

// ----- Component ----- //

function CheckboxInput({
  text, ...otherProps
}: PropTypes) {
  return (
    <label className="component-checkbox">
      <input className="component-checkbox__input" type="checkbox" {...otherProps} />
      <span className="component-checkbox__text">{text}</span>
      <span className="component-checkbox__tick" />
    </label>
  );
}

export { CheckboxInput };
