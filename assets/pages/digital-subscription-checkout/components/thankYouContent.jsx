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
import { classNameWithModifiers } from 'helpers/utilities';

import LeftMarginSection from 'components/leftMarginSection/leftMarginSection';
import CtaLink from 'components/ctaLink/ctaLink';
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
    <div className="thank-you-content">
      <LeftMarginSection>
        <p className={classNameWithModifiers('thank-you-content__copy', ['italic'])}>
          {
            props.paymentMethod === 'DirectDebit' ?
            'Look out for an email within three business days confirming your recurring payment. Your first payment will be taken in 14 days and will appear as \'Guardian Media Group\' on your bank statement.' :
            'We have sent you an email with everything you need to know. Your first payment will be taken in 14 days.'
          }
        </p>
      </LeftMarginSection>
      <AppsSection countryGroupId={props.countryGroupId} />
      <LeftMarginSection modifierClasses={['thank-you-consent']}>
        <MarketingConsent />
      </LeftMarginSection>
    </div>
  );

}


// ----- Auxiliary Components ----- //

function AppsSection(props: { countryGroupId: CountryGroupId }) {

  return (
    <LeftMarginSection modifierClasses={['thank-you-apps']}>
      <h2 className="thank-you-content__heading">
        Can&#39;t wait to get started?
      </h2>
      <p className="thank-you-content__copy">
        Just download the apps and log in with your Guardian account details.
      </p>
      <h3 className="thank-you-content__subheading">
        Premium App
      </h3>
      <CtaLink
        text="Download from the App Store"
        accessibilityHint="Click to download the app on the Apple App Store"
        url={getIosAppUrl(props.countryGroupId)}
      />
      <CtaLink
        text="Download from Google Play"
        accessibilityHint="Click to download the app on the Google Play store"
        url={androidAppUrl}
      />
      <h3 className="thank-you-content__subheading">
        Daily Edition (iPad only)
      </h3>
      <CtaLink
        text="Download the Daily Edition"
        accessibilityHint="Click to download the Daily Tablet Edition app on the Apple App Store"
        url={getDailyEditionUrl(props.countryGroupId)}
      />
    </LeftMarginSection>
  );

}


// ----- Export ----- //


export default connect(state => ({ ...getFormFields(state) }))(ThankYouContent);
