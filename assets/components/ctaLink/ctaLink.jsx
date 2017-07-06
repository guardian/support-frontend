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

const onKeyPressHandler = (handler?: () => void): (event: Object) => void =>
(event: Object) => {
  // Check to see if space or enter were pressed
  if (event.keyCode === 32 || event.keyCode === 13) {
    event.preventDefault();
    if (handler) {
      handler();
    }
  }
};

// ----- Component ----- //

export default function CtaLink(props: PropTypes) {
  return (
    <a className="component-cta-link" href={props.url} onClick={props.onClick} onKeyPress={onKeyPressHandler(props.onClick)} tabIndex={props.tabIndex}>
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

