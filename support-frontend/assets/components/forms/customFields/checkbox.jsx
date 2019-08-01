// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';

import './checkbox.scss';

// ----- Types ----- //

type PropTypes = {
  id?: string,
  text: Node
};

// ----- Component ----- //

function CheckboxInput({
  id, text, ...otherProps
}: PropTypes) {
  return (
    <label className="component-checkbox">
      <input className="component-checkbox__input" type="checkbox" {...otherProps} />
      <span className="component-checkbox__text" id={id}>{text}</span>
      <span className="component-checkbox__tick" />
    </label>
  );
}

CheckboxInput.defaultProps = {
  id: null,
};

export { CheckboxInput };
