// @flow

// ----- Imports ----- //

import React from 'react';

import ContribLegal from 'components/legal/contribLegal/contribLegal';
import CustomerService from 'components/customerService/customerService';
import { privacyLink, copyrightNotice } from 'helpers/legal';
import {
  countryGroups,
  type CountryGroupId,
} from 'helpers/internationalisation/countryGroup';

// ----- Props ----- //

type PropTypes = {
  privacyPolicy: boolean,
  disclaimer: boolean,
  customerService: CustomerService,
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

function Disclaimer(props: { disclaimer: boolean }) {
  return props.disclaimer ? <ContribLegal /> : null;
}

function CustomerServiceText(props: {customerService: CustomerService}) {

  if (props.customerService) {
    return props.customerService;
  }
  else return null;
}


// ----- Component ----- //

function Footer(props: PropTypes) {

  return (
    <footer className="component-footer">
      <div className="component-footer__content gu-content-margin">
        <PrivacyPolicy privacyPolicy={props.privacyPolicy} />
        <CustomerServiceText customerService={props.customerService} />
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
  customerService: null
};


// ----- Exports ----- //

export default Footer;
