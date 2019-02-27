// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';

import { classNameWithModifiers } from 'helpers/utilities';

import './radioInput.scss';

// ----- Types ----- //

type PropTypes = {
  text: Node,
  appearance: 'normal' | 'group',
};

// ----- Component ----- //

function RadioInput({ text, appearance, ...otherProps }: PropTypes) {
  return (
    <label className={classNameWithModifiers('component-radio-input', [appearance])}>
      <input className="component-radio-input__input" type="radio" {...otherProps} />
      <span className="component-radio-input__text">{text}</span>
    </label>
  );
}

// ----- Exports ----- //

RadioInput.defaultProps = {
  appearance: 'normal',
};
export { RadioInput };
