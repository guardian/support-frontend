// @flow

// ----- Imports ----- //

import React from 'react';

import DangerouslySetButtonOnAnyElement, { defaultProps, type PropTypes } from './dangerouslySetButtonOnAnyElement';
import './uiButton.scss';

// ----- Render ----- //

type AllPropTypes = {
  ...PropTypes,
};

const UiAnchorButton = (props: AllPropTypes) => (
  <DangerouslySetButtonOnAnyElement
    element="a"
    {...props}
  />
);

UiAnchorButton.defaultProps = {
  ...defaultProps,
};

export default UiAnchorButton;
