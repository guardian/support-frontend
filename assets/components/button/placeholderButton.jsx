// @flow

// ----- Imports ----- //

import React from 'react';

import SharedButton, { defaultProps, type SharedButtonPropTypes } from './_sharedButton';
import './button.scss';

// ----- Render ----- //

const PlaceholderButton = ({ modifierClasses, ...props }: SharedButtonPropTypes) => (
  <SharedButton
    element="div"
    modifierClasses={['placeholder', ...modifierClasses]}
    {...props}
  />
);

PlaceholderButton.defaultProps = {
  ...defaultProps,
};

export default PlaceholderButton;
