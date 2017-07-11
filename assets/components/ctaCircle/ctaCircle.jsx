// @flow

// ----- Imports ----- //

import React from 'react';
import Svg from 'components/svg/svg';
import { generateClassName } from 'helpers/utilities';
import { clickSubstitueKeyPressHandler } from 'helpers/utilities';

// ----- Types ----- //

type PropTypes = {
  text: string,
  modifierClass: ?string,
  url?: string,
  onClick?: () => void,
  tabIndex?: number,
};


// ----- Component ----- //


const CtaCircle = (props: PropTypes) => {

  const className = generateClassName('component-cta-circle', props.modifierClass);

  return (
    <a
      className={className}
      onClick={props.onClick}
      href={props.url}
      onKeyPress={clickSubstitueKeyPressHandler(props.onClick)}
      tabIndex={props.tabIndex}
    >

      <button tabIndex={-1}><Svg svgName="arrow-right-straight" /></button>
      <span>{props.text}</span>
    </a>
  );
};


CtaCircle.defaultProps = {
  modifierClass: '',
  url: null,
  onClick: null,
  tabIndex: 0,
};


// ----- Exports ----- //

export default CtaCircle;
