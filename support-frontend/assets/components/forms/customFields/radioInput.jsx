// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';

import { classNameWithModifiers } from 'helpers/utilities';

import './radioInput.scss';

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
    <label className={classNameWithModifiers('component-radio-input', [appearance])}>
      <input className="component-radio-input__input" type="radio" {...otherProps} />
      <span className="component-radio-input__text">{text}</span>
      <span className="component-radio-input__image">{image}</span>
    </label>
  );
}

// ----- Exports ----- //

RadioInput.defaultProps = {
  appearance: 'normal',
  image: null,
};
export { RadioInput };
