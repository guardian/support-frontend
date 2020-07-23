// @flow

// ----- Imports ----- //

import React, { Children, type Node } from 'react';
import { css } from '@emotion/core';

import ContribLegal from 'components/legal/contribLegal/contribLegal';
import { privacyLink, copyrightNotice } from 'helpers/legal';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { GBPCountries } from 'helpers/internationalisation/countryGroup';
import Content, { type Appearance } from 'components/content/content';

import Rows from '../base/rows';
import 'pages/digital-subscription-landing/components/digitalSubscriptionLanding.scss';

import { componentFooter, copyright } from './footerStyles';

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

  return (
    <footer css={componentFooter} role="contentinfo">
      {(disclaimer || privacyPolicy || Children.count(children) > 0) &&
        <Content appearance={appearance}>
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
        </Content>
      }
      <Content border appearance={appearance}>
        <span css={copyright}>{copyrightNotice}</span>
      </Content>
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
