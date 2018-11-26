// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';
import SvgArrowRightStraight from 'components/svgs/arrowRightStraight';

import './productPageButton.scss';

// ---- Types ----- //

type PropTypes = {|
  children: Node,
  icon?: Node,
  type: 'submit' | 'button',
  href: ?string,
  disabled: boolean,
  onClick: ?(void => void),
  trackingOnClick: ?(void => void),
|};


// ----- Render ----- //

const ProductPageButton = ({
  children, icon, type, onClick, href, disabled, trackingOnClick,
}: PropTypes) => (href ? (
  <a
    href={href}
    data-disabled={disabled}
    className="component-product-page-button"
    onClick={trackingOnClick}
  >
    <span className="component-product-page-button__content">{children}</span>
    {icon}
  </a>
) : (
  <button
    disabled={disabled}
    onClick={(ev) => { if (onClick) { onClick(ev); } if (trackingOnClick) { trackingOnClick(); } }}
    type={type}
    className="component-product-page-button"
  >
    <span className="component-product-page-button__content">{children}</span>
    {icon}
  </button>
));

ProductPageButton.defaultProps = {
  icon: <SvgArrowRightStraight />,
  type: 'button',
  onClick: null,
  trackingOnClick: null,
  href: null,
  disabled: false,
};

export default ProductPageButton;
