// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';

import { classNameWithModifiers } from 'helpers/utilities';

import './checkbox.scss';

// ----- Types ----- //

type PropTypes = {
  text: Node,
  appearance: 'normal' | 'group',
  image?: Node,
};

// ----- Component ----- //

function RadioInput({
  text, appearance, image, ...otherProps
}: PropTypes) {
  return (
    <label className={classNameWithModifiers('component-checkbox', [appearance])}>
      <input className="component-checkbox__input" type="radio" {...otherProps} />
      <span className="component-checkbox__text">{text}</span>
    </label>
  );
}

// ----- Exports ----- //

RadioInput.defaultProps = {
  appearance: 'normal',
  image: null,
};
export { RadioInput };
