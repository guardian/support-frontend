// @flow

// ----- Imports ----- //

import React from 'react';

import { privacyLink, copyrightNotice } from 'helpers/legal';


// ----- Component ----- //

const LinksFooter = () => (
  <footer className="component-links-footer">
    <div className="component-links-footer__content gu-content-margin">
      <small className="component-links-footer__privacy">
        <a className="component-links-footer__link" href={privacyLink}>
          Privacy Policy
        </a>
      </small>
      <small className="component-links-footer__copyright">{copyrightNotice}</small>
    </div>
  </footer>
);

export default LinksFooter;
