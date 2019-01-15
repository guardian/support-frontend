// @flow

// ----- Imports ----- //

import React from 'react';

import { getClassName, defaultProps, type PropTypes } from './helpers';
import './uiButton.scss';

// ----- Render ----- //

const UiAnchorButton = ({
  children, icon, type, disabled, appearance, iconSide, isStatic, modifierClasses, ...otherProps
}: PropTypes) => (
  <a
    className={getClassName(appearance, iconSide, modifierClasses)}
    {...otherProps}
  >
    <span className="component-ui-button__content">{children}</span>
    {icon}
  </a>
);

/* eslint-disable react/default-props-match-prop-types */
UiAnchorButton.defaultProps = {
  ...defaultProps,
};

export default UiAnchorButton;
