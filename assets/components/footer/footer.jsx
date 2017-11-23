// @flow

// ----- Imports ----- //

import React from 'react';

import ContribLegal from 'components/legal/contribLegal/contribLegal';
import { privacyLink, copyrightNotice } from 'helpers/legal';


// ----- Props ----- //

type PropTypes = {
  privacyPolicy: boolean,
  disclaimer: boolean,
};


// ----- Functions ----- //

function PrivacyPolicy(props: { privacyPolicy: boolean }) {

  if (props.privacyPolicy) {
    return (
      <a className="component-footer__privacy-policy" href={privacyLink}>
        Privacy Policy
      </a>
    );
  }

  return null;

}

function Disclaimer(props: { disclaimer: boolean }) {
  return props.disclaimer ? <ContribLegal /> : null;
}


// ----- Component ----- //

function Footer(props: PropTypes) {

  return (
    <footer className="component-footer">
      <div className="component-footer__content gu-content-margin">
        <PrivacyPolicy privacyPolicy={props.privacyPolicy} />
        <small className="component-footer__copyright">{copyrightNotice}</small>
        <Disclaimer disclaimer={props.disclaimer} />
      </div>
    </footer>
  );

}


// ----- Default Props ----- //

Footer.defaultProps = {
  privacyPolicy: false,
  disclaimer: false,
};


// ----- Exports ----- //

export default Footer;
