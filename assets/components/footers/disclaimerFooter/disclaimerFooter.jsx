// @flow

// ----- Imports ----- //

import React from 'react';

import ContribLegal from 'components/legal/contribLegal/contribLegal';
import { copyrightNotice } from 'helpers/legal';


// ----- Component ----- //

export default function DisclaimerFooter() {

  return (
    <footer className="component-disclaimer-footer">
      <div className="component-disclaimer-footer__content gu-content-margin">
        <small className="component-disclaimer-footer__copyright">{copyrightNotice}</small>
        <ContribLegal />
      </div>
    </footer>
  );

}
