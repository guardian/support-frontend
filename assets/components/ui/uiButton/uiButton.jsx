// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';
import SvgArrowRightStraight from 'components/svgs/arrowRightStraight';
import { classNameWithModifiers } from 'helpers/utilities';

import './uiButton.scss';

/*
This button will be rendered as an <a> element or a <button> element
depending on whether it has an `onClick` parameters or a `href` parameter.
This helps preserve the semantics of the underlying HTML.

Sometimes it is helpful to have both an `href` and `onClick` on an <a>
element for side effects such as sending tracking information.
In that case you can use the `trackingOnClick` prop.
*/

// ---- Types ----- //

type PropTypes = {|
  children: Node,
  icon?: Node,
  type: 'submit' | 'button',
  href: ?string,
  disabled: boolean,
  appearance: 'primary' | 'green' | 'greenHollow' | 'greyHollow',
  iconSide: 'left' | 'right',
  onClick: ?(void => void),
  trackingOnClick: ?(void => void),
|};


// ----- Render ----- //

const UiButton = ({
  children, icon, type, onClick, href, disabled, trackingOnClick, appearance, iconSide,
}: PropTypes) => {

  const getClassName = (modifiers: string[] = []) =>
    classNameWithModifiers('component-product-page-button', [
      appearance,
      `icon-${iconSide}`,
      ...modifiers,
    ]);

  if (!href && !onClick) {
    return (
      <div
        className={getClassName(['static'])}
      >
        <span className="component-product-page-button__content">{children}</span>
        {icon}
      </div>
    );
  } else if (href) {
    return (
      <a
        href={href}
        data-disabled={disabled}
        className={getClassName()}
        onClick={trackingOnClick}
      >
        <span className="component-product-page-button__content">{children}</span>
        {icon}
      </a>
    );
  }
  return (
    <button
      disabled={disabled}
      onClick={(ev) => { if (onClick) { onClick(ev); } if (trackingOnClick) { trackingOnClick(); } }}
      type={type}
      className={getClassName()}
    >
      <span className="component-product-page-button__content">{children}</span>
      {icon}
    </button>
  );
};

UiButton.defaultProps = {
  icon: <SvgArrowRightStraight />,
  type: 'button',
  onClick: null,
  trackingOnClick: null,
  href: null,
  disabled: false,
  appearance: 'primary',
  iconSide: 'right',
};

export default UiButton;
