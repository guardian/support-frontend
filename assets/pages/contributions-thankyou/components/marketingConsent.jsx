// @flow

// ----- Imports ----- //

import React from 'react';
import CtaLink from 'components/ctaLink/ctaLink';
import CheckboxInput from 'components/checkboxInput/checkboxInput';

import { connect } from 'react-redux';
import ErrorMessage from 'components/errorMessage/errorMessage';
import { setGnmMarketing } from 'helpers/user/userActions';
import { sendMarketingPreferencesToIdentity } from '../helpers/consent-api';

// ----- Types ----- //

type PropTypes = {
  consentApiError: boolean,
  onClick: (marketingPreferencesOptIn: boolean, email?: string) => void,
  marketingPreferencesOptIn: boolean,
  marketingPreferenceUpdate: (preference: boolean) => void,
  email?: string,
};

// ----- Component ----- //

function MarketingConsent(props: PropTypes) {

  const showError = (consentApiError: boolean) => {
    if (consentApiError) {
      return <ErrorMessage message="Error confirming selection. Please try again later" />;
    }
    return null;
  };
  if (props.email) {
    return (
      <div>
        <section className="component-info-section marketing-opt-in">
          <div className="component-info-section__header">
            Stay in touch
          </div>
          <div className="thankyou__wrapper marketing-opt-in__wrapper">
            <h2 id="qa-thank-you-message" className="thankyou__subheading">
              <CheckboxInput
                id="gnm-marketing-preference"
                checked={props.marketingPreferencesOptIn || false}
                onChange={props.marketingPreferenceUpdate}
                labelTitle="Subscriptions, membership and supporting The&nbsp;Guardian"
                labelCopy="Get related news and offers - whether you are a subscriber, member, supporter or would like to become one."
              />
            </h2>
            {showError(props.consentApiError)}
            <CtaLink
              onClick={() => props.onClick(props.marketingPreferencesOptIn, props.email)}
              ctaId="Next"
              text="Next"
              accessibilityHint="Go to the guardian dot com front page"
            />
          </div>
        </section>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    onClick: (marketingPreferencesOptIn: boolean, email: string) => {
      sendMarketingPreferencesToIdentity(
        marketingPreferencesOptIn,
        email,
        dispatch,
      );
    },
    marketingPreferenceUpdate: (preference: boolean) => {
      dispatch(setGnmMarketing(preference));
    },
  };
}

function mapStateToProps(state) {
  return {
    email: state.page.user.email,
    marketingPreferencesOptIn: state.page.user.gnmMarketing,
    consentApiError: state.page.thankYouState.consentApiError,
  };
}


MarketingConsent.defaultProps = {
  email: '',
};

export default connect(mapStateToProps, mapDispatchToProps)(MarketingConsent);
