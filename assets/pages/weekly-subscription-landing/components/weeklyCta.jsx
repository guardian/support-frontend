// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';
import SvgArrowRightStraight from 'components/svgs/arrowRightStraight';


// ---- Types ----- //

type PropTypes = {|
  children: Node,
  icon?: Node,
  type: 'submit' | 'button',
  href: ?string,
  disabled: boolean,
  onClick: ?(void => void),
|};


// ----- Render ----- //

const WeeklyCtaButton = ({
  children, icon, type, onClick, href, disabled,
}: PropTypes) => (href ? (
  <a href={href} data-disabled={disabled} className="weekly-cta">
    <span className="weekly-cta__content">{children}</span>
    {icon}
  </a>
) : (
  <button disabled={disabled} onClick={onClick} type={type} className="weekly-cta">
    <span className="weekly-cta__content">{children}</span>
    {icon}
  </button>
));

WeeklyCtaButton.defaultProps = {
  icon: <SvgArrowRightStraight />,
  type: 'button',
  onClick: null,
  href: null,
  disabled: false,
};

export default WeeklyCtaButton;
