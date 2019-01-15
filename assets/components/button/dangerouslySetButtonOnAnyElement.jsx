// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';

import SvgArrowRightStraight from 'components/svgs/arrowRightStraight';
import { classNameWithModifiers } from 'helpers/utilities';

import './button.scss';

// ----- PropTypes ----- //

type Appearance = 'primary' | 'green' | 'greenHollow' | 'greyHollow';
type IconSide = 'left' | 'right';

type GenericPropTypes = {|
  children: Node,
  icon?: Node,
  appearance: Appearance,
  iconSide: IconSide,
  modifierClasses: string[],
|};

type PropTypes = {
  element: 'a' | 'button' | 'div',
  ...GenericPropTypes,
};

// ----- Render ----- //

const DangerouslySetButtonOnAnyElement = ({
  element: HtmlElement, appearance, iconSide, modifierClasses, children, icon, ...otherProps
}: PropTypes) => (
  <HtmlElement
    className={classNameWithModifiers('component-button', [
        appearance,
        `icon-${iconSide}`,
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

DangerouslySetButtonOnAnyElement.defaultProps = { ...defaultProps };

export type { GenericPropTypes, IconSide, Appearance };
export default DangerouslySetButtonOnAnyElement;
