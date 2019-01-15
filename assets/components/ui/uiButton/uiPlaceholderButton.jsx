// @flow

// ----- Imports ----- //

import React from 'react';

import DangerouslySetButtonOnAnyElement, { defaultProps, type PropTypes } from './dangerouslySetButtonOnAnyElement';
import './uiButton.scss';

// ----- Render ----- //

const UiPlaceholderButton = ({ modifierClasses, ...props }: PropTypes) => (
  <DangerouslySetButtonOnAnyElement
    element="div"
    modifierClasses={['placeholder', ...modifierClasses]}
    {...props}
  />
);

UiPlaceholderButton.defaultProps = {
  ...defaultProps,
};

export default UiPlaceholderButton;
