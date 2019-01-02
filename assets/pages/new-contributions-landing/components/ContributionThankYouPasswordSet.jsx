// @flow

// ----- Imports ----- //

import React from 'react';
import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import MarketingConsent from './MarketingConsentContainer';
import ContributionsSurvey from '../components/ContributionsSurvey';
import { ButtonWithRightArrow } from './ButtonWithRightArrow';

type PropTypes = {|
  countryGroupId: CountryGroupId,
|};

// ----- Render ----- //

function ContributionThankYouPasswordSet(props: PropTypes) {
  return (
    <div className="thank-you__container">
      <h1 className="header">You now have a Guardian account</h1>
      <section className="confirmation">
        <p className="confirmation__message">
          Stay signed in so we can recognise you on The Guardian, and you can easily manage your payments and
          preferences.
        </p>
      </section>
      <MarketingConsent />
      <ContributionsSurvey countryGroupId={props.countryGroupId} />
      <ButtonWithRightArrow
        componentClassName="confirmation confirmation--backtothegu"
        buttonClassName=""
        accessibilityHintId="accessibility-hint-return-to-guardian"
        type="button"
        buttonCopy="Return to The Guardian&nbsp;"
        onClick={
          () => {
            window.location.assign('https://www.theguardian.com');
          }
        }
      />
    </div>
  );
}

export default ContributionThankYouPasswordSet;
