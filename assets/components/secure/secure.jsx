// @flow

// ----- Imports ----- //

import React from 'react';

import { SvgLock } from 'components/svgs/lock';

import { classNameWithModifiers } from 'helpers/utilities';


// ----- Props ----- //

type PropTypes = {
  modifierClass?: string,
};


// ----- Component ----- //

export default function Secure(props: PropTypes) {

  return (
    <div className={classNameWithModifiers('component-secure', [props.modifierClass])}>
      <SvgLock />
      <span className="component-secure__text">Secure</span>
    </div>
  );

}


// ----- Default Props ----- //

Secure.defaultProps = {
  modifierClass: '',
};
