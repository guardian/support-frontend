// @flow

// ----- Imports ----- //

import React from 'react';
import { SvgArrowRightStraight } from 'components/svg/svg';
import { generateClassName } from 'helpers/utilities';
import { clickSubstituteKeyPressHandler } from 'helpers/utilities';

// ----- Types ----- //

type PropTypes = {
  text: string,
  modifierClass: ?string,
  url?: ?string,
  onClick?: ?Function,
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
      onKeyPress={props.onClick ? clickSubstituteKeyPressHandler(props.onClick) : null}
      tabIndex={props.tabIndex}
    >

      <button tabIndex={-1}><SvgArrowRightStraight /></button>
      <span>{props.text}</span>
    </a>
  );
};


CtaCircle.defaultProps = {
  modifierClass: null,
  url: null,
  onClick: null,
  tabIndex: 0,
};


// ----- Exports ----- //

export default CtaCircle;
