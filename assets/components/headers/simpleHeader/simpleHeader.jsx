// @flow

// ----- Imports ----- //

import React from 'react';

import { SvgGuardianLogo } from 'components/svg/svg';


// ----- Component ----- //

export default function SimpleHeader() {

  return (
    <header className="component-simple-header">
      <div className="component-simple-header__content gu-header-margin">
        <a className="component-simple-header__link" href="https://www.theguardian.com">
          <div className="accessibility-hint">The guardian logo</div>
          <SvgGuardianLogo />
        </a>
      </div>
    </header>
  );

}
