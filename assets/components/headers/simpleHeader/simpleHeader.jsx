// @flow

// ----- Imports ----- //

import React from 'react';

import Svg from 'components/svg/svg';


// ----- Component ----- //

export default function SimpleHeader() {

  return (
    <header className="component-simple-header">
      <div className="component-simple-header__content gu-header-margin">
        <a className="component-simple-header__link" href="https://www.theguardian.com">
          <Svg svgName="guardian-titlepiece" />
        </a>
      </div>
    </header>
  );

}
