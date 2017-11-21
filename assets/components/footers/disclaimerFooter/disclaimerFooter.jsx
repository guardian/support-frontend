// @flow

// ----- Imports ----- //

import React from 'react';

import ContribLegal from 'components/legal/contribLegal/contribLegal';


// ----- Component ----- //

export default function DisclaimerFooter() {

  return (
    <footer className="component-disclaimer-footer">
      <div className="component-disclaimer-footer__content gu-content-margin">
        <small className="component-disclaimer-footer__copyright">
          &copy; 2017 Guardian News and Media Limited or its affiliated companies.
          All rights reserved.
        </small>
        <ContribLegal />
      </div>
    </footer>
  );

}
