// @flow

// ----- Imports ----- //

import React from 'react';
import Svg from 'components/svg/svg';


// ----- Types ----- //

type PropTypes = {
  text: string,
  url?: string,
  onClick?: () => void,
  tabIndex?: number,
};

// ----- Functions ----- //

const clickSubstitueKeyPressHandler = (handler?: () => void = () => {}) =>
  (event: Object) => {
    const CarriageReturnCode = 13;
    const SpaceCode = 32;

    if (event.keyCode === CarriageReturnCode || event.keyCode === SpaceCode) {
      event.preventDefault();
      handler();
    }
  };

// ----- Component ----- //

export default function CtaLink(props: PropTypes) {
  return (
    <a className="component-cta-link" href={props.url} onClick={props.onClick} onKeyPress={clickSubstitueKeyPressHandler(props.onClick)} tabIndex={props.tabIndex}>
      <span>{props.text}</span>
      <Svg svgName="arrow-right-straight" />
    </a>
  );

}


CtaLink.defaultProps = {
  url: null,
  onClick: null,
  tabIndex: 0,
};

