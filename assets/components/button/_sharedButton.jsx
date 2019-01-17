// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';

import SvgArrowRightStraight from 'components/svgs/arrowRightStraight';
import { classNameWithModifiers } from 'helpers/utilities';

import './button.scss';

// ----- PropTypes ----- //

type Appearance = 'primary' | 'green' | 'greenHollow' | 'greyHollow';
type IconSide = 'left' | 'right';

type SharedButtonPropTypes = {|
  children: string,
  icon?: Node,
  appearance: Appearance,
  iconSide: IconSide,
  modifierClasses: string[],
|};

type PropTypes = {
  element: 'a' | 'button' | 'div',
  ...SharedButtonPropTypes,
};

// ----- Render ----- //

const SharedButton = ({
  element: HtmlElement, appearance, iconSide, modifierClasses, children, icon, ...otherProps
}: PropTypes) => (
  <HtmlElement
    className={classNameWithModifiers('component-button', [
        appearance,
        `hasicon-${iconSide}`,
        ...modifierClasses,
      ])}
    {...otherProps}
  >
    <span className="component-button__content">{children}</span>
    {icon}
  </HtmlElement>
);

export const defaultProps = {
  icon: <SvgArrowRightStraight />,
  appearance: 'primary',
  iconSide: 'right',
  modifierClasses: [],
};

SharedButton.defaultProps = { ...defaultProps };

export type { SharedButtonPropTypes, IconSide, Appearance };
export default SharedButton;
