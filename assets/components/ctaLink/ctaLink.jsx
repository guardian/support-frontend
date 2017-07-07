// @flow

// ----- Imports ----- //

import React from 'react';
import Svg from 'components/svg/svg';
import { clickSubstitueKeyPressHandler } from 'helpers/utilities';


// ----- Types ----- //

type PropTypes = {
  text: string,
  url?: string,
  onClick?: () => void,
  tabIndex?: number,
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

