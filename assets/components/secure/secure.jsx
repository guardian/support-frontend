// @flow

// ----- Imports ----- //

import React from 'react';

import { SvgLock } from 'components/svg/svg';


// ----- Component ----- //

export default function Secure(props: {style: Object}) {

  return (
    <div className="component-secure" style={props.style}>
      <SvgLock />
      <span className="component-secure__text">Secure</span>
    </div>
  );

}
