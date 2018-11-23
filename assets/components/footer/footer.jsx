// @flow

// ----- Imports ----- //

import React from 'react';
import type { Node } from 'react';

import ContribLegal from 'components/legal/contribLegal/contribLegal';
import { copyrightNotice } from 'helpers/legal';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import TermsPrivacy from '../legal/termsPrivacy/termsPrivacy';

// ----- Props ----- //

type PropTypes = {|
  disclaimer: boolean,
  countryGroupId: CountryGroupId,
  children: Node,
|};


// ----- Functions ----- //

function Disclaimer(props: { disclaimer: boolean, countryGroupId: CountryGroupId }) {
  if (props.disclaimer) {
    return (
      <div>
        <TermsPrivacy countryGroupId={props.countryGroupId} />
        <ContribLegal countryGroupId={props.countryGroupId} />
      </div>);
  }
  return null;
}

// ----- Component ----- //

function Footer(props: PropTypes) {

  return (
    <footer className="component-footer" role="contentinfo">
      <div className="component-footer__content">
        {props.children}
        <small className="component-footer__copyright">{copyrightNotice}</small>
        <Disclaimer disclaimer={props.disclaimer} countryGroupId={props.countryGroupId} />
      </div>
    </footer>
  );

}


// ----- Default Props ----- //

Footer.defaultProps = {
  disclaimer: false,
  countryGroupId: 'GBPCountries',
  children: [],
};


// ----- Exports ----- //

export default Footer;
