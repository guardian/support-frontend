// @flow

// ----- Imports ----- //

import React from 'react';
import { SvgArrowRightStraight } from 'components/svg/svg';
import { classNameWithModifiers } from 'helpers/utilities';
import { clickSubstituteKeyPressHandler } from 'helpers/utilities';

// ----- Types ----- //

type PropTypes = {
  text: string,
  modifierClass?: ?string,
  url?: ?string,
  onClick?: ?() => void,
  tabIndex?: number,
};


// ----- Component ----- //

const CtaCircle = (props: PropTypes) => {

  const className = classNameWithModifiers('component-cta-circle', [props.modifierClass]);

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
  url: null,
  onClick: null,
  tabIndex: 0,
  modifierClass: null,
};


// ----- Exports ----- //

export default CtaCircle;
