// @flow

// ----- Imports ----- //

import React from 'react';

import DangerouslySetButtonOnAnyElement, { defaultProps, type GenericPropTypes } from './dangerouslySetButtonOnAnyElement';
import './button.scss';

// ----- Render ----- //

const PlaceholderButton = ({ modifierClasses, ...props }: GenericPropTypes) => (
  <DangerouslySetButtonOnAnyElement
    element="div"
    modifierClasses={['placeholder', ...modifierClasses]}
    {...props}
  />
);

PlaceholderButton.defaultProps = {
  ...defaultProps,
};

export default PlaceholderButton;
