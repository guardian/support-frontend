// @flow

// ----- Imports ----- //

import React from 'react';

import SharedButton, { defaultProps, type SharedButtonPropTypes } from './_sharedButton';
import './button.scss';

// ----- Render ----- //

type PropTypes = {
  ...SharedButtonPropTypes,
  'aria-label': ?string,
  href: string,
};

const AnchorButton = (props: PropTypes) => (
  <SharedButton
    element="a"
    {...props}
  />
);

AnchorButton.defaultProps = {
  ...defaultProps,
};

export default AnchorButton;
