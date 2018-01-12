// @flow

// ----- Imports ----- //

import React from 'react';
import CtaLink from 'components/ctaLink/ctaLink';
import CheckboxInput from 'components/checkboxInput/checkboxInput';

import { connect } from 'react-redux';
import { setMarketingPreferencesSelected, sendMarketingPreferencesToIdentity } from
  '../contributionsThankyouActions';
import { setGnmMarketing } from '../../../helpers/user/userActions';

// ----- Types ----- //

type PropTypes = {
  onClick: (marketingPreferencesOptIn: boolean, email?: string) => void,
  marketingPreferencesSelected: boolean,
  marketingPreferencesOptIn: boolean,
  marketingPreferenceUpdate: (preference: boolean) => void,
  email?: string,
};

// ----- Component ----- //

function MarketingConsent(props: PropTypes) {
  if (props.marketingPreferencesSelected === false) {
    return (
      <div>
        <section className="component-info-section component-marketing">
          <div className="thankyou__wrapper">
            <h2 className="thankyou__heading">We would like to hear from you</h2>
            <h2 id="qa-thank-you-message" className="thankyou__subheading">
              <CheckboxInput
                id="gnm-marketing-preference"
                checked={props.marketingPreferencesOptIn || false}
                onChange={props.marketingPreferenceUpdate}
                labelText="Whether you’re a subscriber, a member or you support us via a regular or one-off contribution, opt in here so we can keep sending you news, updates and more. If you don’t, then we won’t be able to contact you again.
                        If you’d like to hear about our wide range of subscription offers - or you’re interested in helpi"
              />
            </h2>
            <CtaLink
              onClick={() => props.onClick(props.marketingPreferencesOptIn, props.email)}
              ctaId="next"
              text="next"
              accessibilityHint="Go to the guardian dot com front page"
            />
          </div>
        </section>
      </div>);
  }
}

function mapDispatchToProps(dispatch) {

  return {
    onClick: (marketingPreferencesOptIn: boolean, email?: string) => {
      dispatch(setMarketingPreferencesSelected());
      dispatch(sendMarketingPreferencesToIdentity(marketingPreferencesOptIn, email));
    },
    marketingPreferenceUpdate: (preference: boolean) => {
      dispatch(setGnmMarketing(preference));
    },
  };
}

function mapStateToProps(state) {
  return {
    marketingPreferencesSelected:
      state.page.regularContributionsThankYou.marketingPreferencesSelected,
    email: state.page.user.email,
    marketingPreferencesOptIn: state.page.user.gnmMarketing,
  };
}


MarketingConsent.defaultProps = {
  email: '',
};

export default connect(mapStateToProps, mapDispatchToProps)(MarketingConsent);
