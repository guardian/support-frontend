// @flow

// ----- Imports ----- //

import React from 'react';
import type { Node } from 'react';

import ContribLegal from 'components/legal/contribLegal/contribLegal';
import { privacyLink, copyrightNotice } from 'helpers/legal';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';

// ----- Props ----- //

type PropTypes = {
  privacyPolicy: boolean,
  disclaimer: boolean,
  countryGroupId: CountryGroupId,
  children: Node,
};


// ----- Functions ----- //

function PrivacyPolicy(props: { privacyPolicy: boolean }) {

  if (props.privacyPolicy) {
    return (
      <div className="component-footer__privacy-policy-text">
        To find out what personal data we collect and how we use it, please visit our
        <a className="component-footer__privacy-policy" href={privacyLink}> Privacy Policy</a>.
      </div>
    );
  }

  return null;

}

function Disclaimer(props: { disclaimer: boolean, countryGroupId: CountryGroupId }) {
  return props.disclaimer ? <ContribLegal countryGroupId={props.countryGroupId} /> : null;
}

// ----- Component ----- //

function Footer(props: PropTypes) {

  return (
    <footer className="component-footer">
      <div className="component-footer__content">
        <PrivacyPolicy privacyPolicy={props.privacyPolicy} />
        {props.children}
        <small className="component-footer__copyright">{copyrightNotice}</small>
        <Disclaimer disclaimer={props.disclaimer} countryGroupId={props.countryGroupId} />
      </div>
    </footer>
  );

}


// ----- Default Props ----- //

Footer.defaultProps = {
  privacyPolicy: false,
  disclaimer: false,
  countryGroupId: 'GBPCountries',
  children: [],
};


// ----- Exports ----- //

export default Footer;
