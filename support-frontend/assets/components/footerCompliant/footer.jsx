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
import FooterContainer from './containers/container';
import { BackToTop } from './BackToTop';

// ----- Props ----- //

type PropTypes = {|
  privacyPolicy: boolean,
  disclaimer: boolean,
  countryGroupId: CountryGroupId,
  children: Node,
|};


// ----- Component ----- //

function Footer({
  disclaimer, privacyPolicy, children, countryGroupId,
}: PropTypes) {

  // It would probably be helpful to replace the Content and Rows components with emotion

  return (
    <footer css={componentFooter} role="contentinfo">
      {(disclaimer || privacyPolicy || Children.count(children) > 0) &&
        <FooterContainer border paddingTop>
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
      <FooterContainer border>
        <ul css={linksList}>
          <li css={link}>
            <a href="/">Privacy Policy</a>
          </li>
          <li css={link}>
            <a href="/">Contact us</a>
          </li>
          <li css={link}>
            <a href="/">FAQs</a>
          </li>
          <li css={link}>
            <a href="/">Terms & Conditions</a>
          </li>
        </ul>
        <div css={backToTopLink}>
          <BackToTop />
        </div>
      </FooterContainer>
      <FooterContainer paddingTop>
        <span css={copyright}>{copyrightNotice}</span>
      </FooterContainer>
    </footer>
  );

}


// ----- Default Props ----- //

Footer.defaultProps = {
  privacyPolicy: false,
  disclaimer: false,
  countryGroupId: GBPCountries,
  children: [],
};


// ----- Exports ----- //

export default Footer;
