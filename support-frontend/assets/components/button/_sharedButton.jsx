// @flow

// ----- Imports ----- //

import React, { createElement, type Node } from 'react';

import SvgArrowRightStraight from 'components/svgs/arrowRightStraight';
import { classNameWithModifiers } from 'helpers/utilities';

import './button.scss';

// ----- PropTypes ----- //

export const Appearances = {
  primary: 'primary',
  secondary: 'secondary',
  green: 'green',
  greenHollow: 'greenHollow',
  greyHollow: 'greyHollow',
};
export const Sides = {
  right: 'right', left: 'left',
};

type Appearance = $Keys<typeof Appearances>;
type IconSide = $Keys<typeof Sides>;

/* **********************************************************************
Note: postDeploymentTestID will be prefixed with 'qa' to indicate it is
used in a test and avoid any confusion by anyone looking at the DOM that
we are using ID for anything other than QA testing.
************************************************************************ */

type SharedButtonPropTypes = {|
  children: string,
  icon?: Node,
  appearance: Appearance,
  iconSide: IconSide,
  getRef?: (?Element) => void,
  modifierClasses: string[],
  postDeploymentTestID?: string,
|};

type PropTypes = {
  element: 'a' | 'button' | 'div',
  ...SharedButtonPropTypes,
};

// ----- Render ----- //

const SharedButton = ({
  element, appearance, iconSide, modifierClasses, children, icon, getRef, postDeploymentTestID, ...otherProps
}: PropTypes) => {

  const className = classNameWithModifiers('component-button', [
    appearance,
    `hasicon-${iconSide}`,
    ...modifierClasses,
  ]);

  const contents = [
    (<span className="component-button__content">{children}</span>),
    icon,
  ];

  return createElement(element, {
    className,
    ref: getRef,
    id: `qa-${postDeploymentTestID}`,
    ...otherProps,
  }, contents);
};

export const defaultProps = {
  icon: <SvgArrowRightStraight />,
  appearance: Object.keys(Appearances)[0],
  iconSide: Object.keys(Sides)[0],
  modifierClasses: [],
};

SharedButton.defaultProps = { ...defaultProps };

export type { SharedButtonPropTypes, IconSide, Appearance };
export default SharedButton;
