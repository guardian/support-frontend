// @flow

// ----- Imports ----- //

import React from 'react';
import Svg from 'components/svg/svg';
import { clickSubstituteKeyPressHandler } from 'helpers/utilities';

import type { SvgName } from 'components/svg/svg';


// ----- Types ----- //

type PropTypes = {
  text: string,
  url?: ?string,
  onClick?: ?Function,
  tabIndex?: number,
  id?: ?string,
  svgName: SvgName,
};

// ----- Component ----- //

export default function CtaLink(props: PropTypes) {

  return (
    <a
      id={props.id}
      className="component-cta-link"
      href={props.url}
      onClick={props.onClick}
      onKeyPress={props.onClick ? clickSubstituteKeyPressHandler(props.onClick) : null}
      tabIndex={props.tabIndex}
    >
      <span>{props.text}</span>
      <Svg svgName={props.svgName} />
    </a>
  );

}


// ----- Default Props ----- //

CtaLink.defaultProps = {
  url: null,
  onClick: null,
  tabIndex: 0,
  id: null,
  svgName: 'arrow-right-straight',
};
