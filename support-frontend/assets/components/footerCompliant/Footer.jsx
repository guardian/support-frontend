// @flow

// ----- Imports ----- //

import React, { Children, type Node } from 'react';

import ContribLegal from 'components/legal/contribLegal/contribLegal';
import { privacyLink, copyrightNotice } from 'helpers/legal';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { GBPCountries } from 'helpers/internationalisation/countryGroup';

import Rows from '../base/rows';
import 'pages/digital-subscription-landing/components/digitalSubscriptionLanding.scss';

import { backToTopLink, componentFooter, copyright, linksList, link } from './footerStyles';
import FooterContent from './containers/FooterContent';
import { BackToTop } from './BackToTop';

// ----- Props ----- //

type PropTypes = {|
  privacyPolicy: boolean,
  disclaimer: boolean,
  faqsLink: string,
  termsConditionsLink: string,
  countryGroupId: CountryGroupId,
  children: Node,
|};


// ----- Component ----- //

function Footer({
  disclaimer, privacyPolicy, children, countryGroupId, faqsLink, termsConditionsLink,
}: PropTypes) {
  return (
    <footer css={componentFooter} role="contentinfo">
      {(disclaimer || privacyPolicy || Children.count(children) > 0) &&
        <FooterContent border paddingTop>
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
        </FooterContent>
      }
      <FooterContent border>
        <ul css={linksList}>
          <li css={link}>
            <a href="https://www.theguardian.com/help/privacy-policy">Privacy Policy</a>
          </li>
          <li css={link}>
            <a href="https://www.theguardian.com/help/contact-us">Contact us</a>
          </li>
          <li css={link}>
            <a href={faqsLink}>FAQs</a>
          </li>
          {termsConditionsLink &&
            <li css={link}>
              <a href={termsConditionsLink}>Terms & Conditions</a>
            </li>
          }
        </ul>
      </FooterContent>
      <FooterContent paddingTop>
        <div css={backToTopLink}>
          <BackToTop />
        </div>
        <span css={copyright}>{copyrightNotice}</span>
      </FooterContent>
    </footer>
  );

}


// ----- Default Props ----- //

Footer.defaultProps = {
  privacyPolicy: false,
  disclaimer: false,
  faqsLink: 'https://www.theguardian.com/help',
  termsConditionsLink: '',
  countryGroupId: GBPCountries,
  children: [],
};


// ----- Exports ----- //

export default Footer;
