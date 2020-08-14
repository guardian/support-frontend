// @flow

// ----- Imports ----- //

import React, { Children, type Node } from 'react';
import { ThemeProvider } from 'emotion-theming';
import { Link, linkBrand } from '@guardian/src-link';

import ContribLegal from 'components/legal/contribLegal/contribLegal';
import { copyrightNotice } from 'helpers/legal';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { GBPCountries } from 'helpers/internationalisation/countryGroup';

import Rows from '../base/rows';
import 'pages/digital-subscription-landing/components/digitalSubscriptionLanding.scss';

import { backToTopLink, componentFooter, copyright, linksList, link } from './footerStyles';
import FooterContent from './containers/FooterContent';
import { BackToTop } from './BackToTop';

// ----- Props ----- //

type PropTypes = {|
  centred: boolean,
  disclaimer: boolean,
  faqsLink: string,
  termsConditionsLink: string,
  countryGroupId: CountryGroupId,
  children: Node,
|};


// ----- Component ----- //

function Footer({
  centred, disclaimer, children, countryGroupId, faqsLink, termsConditionsLink,
}: PropTypes) {
  return (
    <footer css={componentFooter} role="contentinfo">
      <ThemeProvider theme={linkBrand}>
        {(disclaimer || Children.count(children) > 0) &&
        <FooterContent appearance={{ border: true, paddingTop: true, centred }}>
          <div>
            <Rows>
              {children}
              {disclaimer && <ContribLegal countryGroupId={countryGroupId} />}
            </Rows>
          </div>
        </FooterContent>
      }
        <FooterContent appearance={{ border: true, centred }}>
          <ul css={linksList}>
            <li css={link}>
              <Link subdued href={faqsLink}>FAQs</Link>
            </li>
            <li css={link}>
              <Link subdued href="https://www.theguardian.com/help/contact-us">Contact us</Link>
            </li>
            <li css={link}>
              <Link subdued href="https://www.theguardian.com/help/privacy-policy">Privacy Policy</Link>
            </li>
            {termsConditionsLink &&
              <li css={link}>
                <Link subdued href={termsConditionsLink}>Terms & Conditions</Link>
              </li>
            }
          </ul>
        </FooterContent>
        <FooterContent appearance={{ centred }}>
          <div css={backToTopLink}>
            <BackToTop />
          </div>
          <span css={copyright}>{copyrightNotice}</span>
        </FooterContent>
      </ThemeProvider>
    </footer>
  );

}


// ----- Default Props ----- //

Footer.defaultProps = {
  centred: false,
  disclaimer: false,
  faqsLink: 'https://www.theguardian.com/help',
  termsConditionsLink: '',
  countryGroupId: GBPCountries,
  children: [],
};


// ----- Exports ----- //

export default Footer;
