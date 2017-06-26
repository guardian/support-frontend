// @flow

// ----- Imports ----- //

import React from 'react';
import Svg from 'components/svg/svg';
import { generateClassName } from 'helpers/utilities';


// ----- Types ----- //

type PropTypes = {
  text: string,
  modifierClass: ?string,
  onClick: () => void,
};


// ----- Component ----- //


const CtaCircle = (props: PropTypes) => {

  const className = generateClassName('component-cta-circle', props.modifierClass);

  return (
    <a className={className} onClick={props.onClick} role="link" tabIndex={0}>
      <button><Svg svgName="arrow-right-straight" /></button>
      <span>{props.text}</span>
    </a>
  );
};


CtaCircle.defaultProps = {
  modifierClass: '',
};


// ----- Exports ----- //

export default CtaCircle;
