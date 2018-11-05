// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';
import SvgArrowRightStraight from 'components/svgs/arrowRightStraight';


// ---- Types ----- //

type PropTypes = {|
  children: Node,
  icon?: Node,
  type: 'submit' | 'button',
  onClick: ?(void => void),
|};


// ----- Render ----- //

const WeeklyCtaButton = ({
  children, icon, type, onClick,
}: PropTypes) => (
  <button onClick={onClick} type={type} className="component-weekly-cta-button">
    <span className="component-weekly-cta-button__content">{children}</span>
    {icon}
  </button>
);

WeeklyCtaButton.defaultProps = {
  icon: <SvgArrowRightStraight />,
  type: 'button',
  onClick: null,
};

export default WeeklyCtaButton;
