// @flow

// ----- Imports ----- //

import React from 'react';

import SvgLock from 'components/svgs/lock';

import { classNameWithModifiers } from 'helpers/utilities';


// ----- Props ----- //

type PropTypes = {
  modifiers: Array<?string>,
};


// ----- Component ----- //

export default function Secure(props: PropTypes) {


  return (
    <div className={classNameWithModifiers('component-secure', props.modifiers)}>
      <SvgLock />
      <span className="component-secure__text">Secure</span>
    </div>
  );

}


// ----- Default Props ----- //

Secure.defaultProps = {
  modifiers: [],
};
