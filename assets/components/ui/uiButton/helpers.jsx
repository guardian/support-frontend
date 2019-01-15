// @flow


// ----- Imports ----- //
import React, { type Node } from 'react';
import SvgArrowRightStraight from 'components/svgs/arrowRightStraight';
import { classNameWithModifiers } from 'helpers/utilities';

type Appearance = 'primary' | 'green' | 'greenHollow' | 'greyHollow';
type IconSide = 'left' | 'right';

type PropTypes = {
  children: Node,
  icon?: Node,
  appearance: Appearance,
  iconSide: IconSide,
  modifierClasses: string[],
};

// ----- Exports ----- //
const defaultProps = {
  icon: <SvgArrowRightStraight />,
  appearance: 'primary',
  iconSide: 'right',
  modifierClasses: [],
};

const getClassName = (appearance: Appearance, iconSide: IconSide, modifierClasses: string[] = []) =>
  classNameWithModifiers('component-ui-button', [
    appearance,
    `icon-${iconSide}`,
    ...modifierClasses,
  ]);

export type { PropTypes, IconSide, Appearance };
export { getClassName, defaultProps };
