// @flow

// ----- Imports ----- //

import React from 'react';

import { SvgLock } from 'components/svg/svg';


// ----- Component ----- //

export default function Secure() {

  return (
    <div className="component-secure">
      <SvgLock />
      <span className="component-secure__text">Secure</span>
    </div>
  );

}
