// @flow

// ----- Imports ----- //

import React from 'react';

import { copyrightNotice } from 'helpers/legal';


// ----- Component ----- //

const SimpleFooter = () => (
  <footer className="component-simple-footer">
    <div className="component-simple-footer__content gu-content-margin">
      <small className="component-simple-footer__copyright">{copyrightNotice}</small>
    </div>
  </footer>
);

export default SimpleFooter;
