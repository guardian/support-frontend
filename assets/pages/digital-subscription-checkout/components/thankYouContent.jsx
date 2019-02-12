// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';

import ProductPageContentBlock from 'components/productPage/productPageContentBlock/productPageContentBlock';
import ProductPageTextBlock, { LargeParagraph } from 'components/productPage/productPageTextBlock/productPageTextBlock';
import MarketingConsent from './thankYou/marketingConsentContainer';
import AppsSection from './thankYou/appsSection';

import {
  getFormFields,
  type FormFields,
} from '../digitalSubscriptionCheckoutReducer';

// ----- Types ----- //

type PropTypes = {
  countryGroupId: CountryGroupId,
    ...FormFields,
};


// ----- Component ----- //

function ThankYouContent(props: PropTypes) {

  return (
    <div>
      <ProductPageContentBlock>
        <ProductPageTextBlock>
          <LargeParagraph>
            {
            props.paymentMethod === 'DirectDebit' ?
            'Look out for an email within three business days confirming your recurring payment. Your first payment will be taken in 14 days and will appear as \'Guardian Media Group\' on your bank statement.' :
            'We have sent you an email with everything you need to know. Your first payment will be taken in 14 days.'
          }
          </LargeParagraph>
        </ProductPageTextBlock>
      </ProductPageContentBlock>
      <ProductPageContentBlock>
        <ProductPageTextBlock title="Can&#39;t wait to get started?">
          <LargeParagraph>
            Just download the apps and log in with your Guardian account details.
          </LargeParagraph>
        </ProductPageTextBlock>
        <AppsSection countryGroupId={props.countryGroupId} />
      </ProductPageContentBlock>
      <ProductPageContentBlock>
        <MarketingConsent render={({ title, message }) => (
          <ProductPageTextBlock title={title}>{message}</ProductPageTextBlock>
        )}
        />
      </ProductPageContentBlock>
    </div>
  );

}

// ----- Export ----- //


export default connect(state => ({ ...getFormFields(state) }))(ThankYouContent);
