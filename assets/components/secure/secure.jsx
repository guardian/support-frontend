// @flow

// ----- Imports ----- //

import React from 'react';

import Svg from 'components/svg/svg';


// ----- Component ----- //

export default function Secure() {

  return (
    <div className="component-secure">
      <Svg svgName="lock" />
      <span className="component-secure__text">Secure</span>
    </div>
  );

}
