// @flow

// ----- Imports ----- //

import React from 'react';

import Svg from 'components/svg/svg';


// ----- Component ----- //

export default function SimpleHeader() {

  return (
    <header className="component-simple-header">
      <div className="component-simple-header__content gu-header-margin">
        <Svg svgName="guardian-titlepiece" />
      </div>
    </header>
  );

}
