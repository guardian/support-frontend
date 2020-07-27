// @flow

// ----- Imports ----- //

import React, { Children, type Node } from 'react';

import ContribLegal from 'components/legal/contribLegal/contribLegal';
import { privacyLink, copyrightNotice } from 'helpers/legal';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { GBPCountries } from 'helpers/internationalisation/countryGroup';
import Content, { type Appearance } from 'components/content/content';

import Rows from '../base/rows';
import 'pages/digital-subscription-landing/components/digitalSubscriptionLanding.scss';

import { componentFooter, copyright } from './footerStyles';
import FooterContainer from './containers/container';
import FooterLinksList from './links/linksList';
import FooterLink from './links/link';

// ----- Props ----- //

type PropTypes = {|
  privacyPolicy: boolean,
  disclaimer: boolean,
  countryGroupId: CountryGroupId,
  children: Node,
  appearance: Appearance,
|};


// ----- Component ----- //

function Footer({
  disclaimer, privacyPolicy, children, countryGroupId, appearance,
}: PropTypes) {

  // It would probably be helpful to replace the Content and Rows components with emotion

  return (
    <footer css={componentFooter} role="contentinfo">
      {(disclaimer || privacyPolicy || Children.count(children) > 0) &&
        <FooterContainer leftBorder>
          <div>
            <Rows>
              {privacyPolicy &&
              <div className="component-footer__privacy-policy-text">
                To find out what personal data we collect and how we use it, please visit our
                <a href={privacyLink}> Privacy Policy</a>.
              </div>
              }
              {children}
              {disclaimer && <ContribLegal countryGroupId={countryGroupId} />}
            </Rows>
          </div>
        </FooterContainer>
      }
      <FooterContainer leftBorder>
        <FooterLinksList>
          <FooterLink href="/">Privacy Policy</FooterLink>
          <FooterLink href="/">Contact us</FooterLink>
          <FooterLink href="/">FAQs</FooterLink>
          <FooterLink href="/">Terms & Conditions</FooterLink>
        </FooterLinksList>
      </FooterContainer>
      <FooterContainer>
        <span css={copyright}>{copyrightNotice}</span>
      </FooterContainer>
    </footer>
  );

}


// ----- Default Props ----- //

Footer.defaultProps = {
  privacyPolicy: false,
  disclaimer: false,
  appearance: 'feature',
  countryGroupId: GBPCountries,
  children: [],
};


// ----- Exports ----- //

export default Footer;
