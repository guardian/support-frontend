// @flow

// ----- Imports ----- //

import React from 'react';

import SharedButton, { defaultProps, type SharedButtonPropTypes } from './_sharedButton';
import './button.scss';

// ----- Render ----- //

const NonInteractiveButton = ({ modifierClasses, ...props }: SharedButtonPropTypes) => (
  <SharedButton
    element="div"
    modifierClasses={['nonInteractive', ...modifierClasses]}
    {...props}
  />
);

NonInteractiveButton.defaultProps = {
  ...defaultProps,
};

export default NonInteractiveButton;
