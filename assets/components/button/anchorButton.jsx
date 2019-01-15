// @flow

// ----- Imports ----- //

import React from 'react';

import DangerouslySetButtonOnAnyElement, { defaultProps, type PropTypes } from './dangerouslySetButtonOnAnyElement';
import './button.scss';

// ----- Render ----- //

type AllPropTypes = {
  ...PropTypes,
  'aria-label': ?string,
};

const AnchorButton = (props: AllPropTypes) => (
  <DangerouslySetButtonOnAnyElement
    element="a"
    {...props}
  />
);

AnchorButton.defaultProps = {
  ...defaultProps,
};

export default AnchorButton;
