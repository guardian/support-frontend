// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';

import SvgArrowRightStraight from 'components/svgs/arrowRightStraight';
import { classNameWithModifiers } from 'helpers/utilities';

import './uiButton.scss';

// ----- PropTypes ----- //

type Appearance = 'primary' | 'green' | 'greenHollow' | 'greyHollow';
type IconSide = 'left' | 'right';

type PropTypes = {|
  children: Node,
  icon?: Node,
  appearance: Appearance,
  iconSide: IconSide,
  modifierClasses: string[],
|};

type DangerousPropTypes = {
  element: 'a' | 'button' | 'div',
  ...PropTypes,
};

// ----- Render ----- //

export const defaultProps = {
  icon: <SvgArrowRightStraight />,
  appearance: 'primary',
  iconSide: 'right',
  modifierClasses: [],
};

const DangerouslySetButtonOnAnyElement = ({
  element, appearance, iconSide, modifierClasses, children, icon, ...otherProps
}: DangerousPropTypes) => {
  const El = element;
  return (
    <El
      className={classNameWithModifiers('component-ui-button', [
        appearance,
        `icon-${iconSide}`,
        ...modifierClasses,
      ])}
      {...otherProps}
    >
      <span className="component-ui-button__content">{children}</span>
      {icon}
    </El>
  );
};

DangerouslySetButtonOnAnyElement.defaultProps = { ...defaultProps };

export type { PropTypes, IconSide, Appearance };
export default DangerouslySetButtonOnAnyElement;
