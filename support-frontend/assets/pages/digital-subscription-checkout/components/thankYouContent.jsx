// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import {
  getIosAppUrl,
  androidAppUrl,
  getDailyEditionUrl,
} from 'helpers/externalLinks';


import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { sendTrackingEventsOnClick } from 'helpers/subscriptions';

import ProductPageContentBlock from 'components/productPage/productPageContentBlock/productPageContentBlock';
import ProductPageTextBlock, { LargeParagraph } from 'components/productPage/productPageTextBlock/productPageTextBlock';
import AnchorButton from 'components/button/anchorButton';
import MarketingConsent from './MarketingConsentContainer';

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


// ----- Auxiliary Components ----- //

function AppsSection(props: { countryGroupId: CountryGroupId }) {

  return (
    <div>
      <ProductPageTextBlock title="Can&#39;t wait to get started?">
        <LargeParagraph>
        Just download the apps and log in with your Guardian account details.
        </LargeParagraph>
      </ProductPageTextBlock>
      <ProductPageTextBlock title="Premium App" headingSize={3}>
        <p>
          Your enhanced experience of The Guardian
          for mobile and tablet, with exclusive features and ad-free reading.
        </p>
        <div className="thank-you-stage__ctas">
          <AnchorButton
            appearance="greyHollow"
            aria-label="Click to download the app on the Apple App Store"
            href={getIosAppUrl(props.countryGroupId)}
            onClick={sendTrackingEventsOnClick('checkout_thankyou_app_store', 'DigitalPack', null)}
          >
            Download from the App Store
          </AnchorButton>
          <AnchorButton
            aria-label="Click to download the app on the Google Play store"
            appearance="greyHollow"
            href={androidAppUrl}
            onClick={sendTrackingEventsOnClick('checkout_thankyou_play_store', 'DigitalPack', null)}
          >
            Download from Google Play
          </AnchorButton>
        </div>
      </ProductPageTextBlock>
      <ProductPageTextBlock title="Daily Edition (iPad only)" headingSize={3}>
        <p>Every issue of The Guardian and Observer, designed for your iPad and available offline.</p>
        <div className="thank-you-stage__ctas">
          <AnchorButton
            appearance="greyHollow"
            aria-label="Click to download the Daily Tablet Edition app on the Apple App Store"
            href={getDailyEditionUrl(props.countryGroupId)}
            onClick={sendTrackingEventsOnClick('checkout_thankyou_daily_edition', 'DigitalPack', null)}
          >
            Download the Daily Edition
          </AnchorButton>
        </div>
      </ProductPageTextBlock>
    </div>
  );

}


// ----- Export ----- //


export default connect(state => ({ ...getFormFields(state) }))(ThankYouContent);
