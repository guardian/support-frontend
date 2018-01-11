// @flow

// ----- Imports ----- //

import React from 'react';
import CtaLink from 'components/ctaLink/ctaLink';
import CheckboxInput from 'components/checkboxInput/checkboxInput';

import { connect } from 'react-redux';
import { setMarketingPreferencesSelected, sendMarketingPreferencesToIdentity } from
  '../../../../pages/contributions-thankyou/regularContributionsThankyouActions';
import {setEmail, setFullName, setGnmMarketing, setPostcode} from "../../../../helpers/user/userActions";

// ----- Types ----- //

type PropTypes = {
  onClick: (marketingPreferencesOptIn: boolean) => void,
  marketingPreferencesSelected: boolean,
  marketingPreferencesOptIn: boolean,
  marketingPreferenceUpdate: (preference: boolean) => void,
};

// ----- Component ----- //

function MarketingConsent(props: PropTypes) {
  console.log("prefs1 = " + props.marketingPreferencesSelected.toString())
  if (props.marketingPreferencesSelected === false) {
    console.log("here");
    return (
      <div className="thankyou__wrapper">
        <h1 className="thankyou__heading">We would like to hear from you</h1>
        <h2 id="qa-thank-you-message" className="thankyou__subheading">
          <CheckboxInput
            id="gnm-marketing-preference"
            checked={props.marketingPreferencesOptIn || false}
            onChange={props.marketingPreferenceUpdate}
            labelText="Some text that asks for permissions. It's gonna be pretty long so I'm writing some random text. I like turtles"
          />
        </h2>
        <CtaLink
          onClick={props.onClick(props.marketingPreferencesOptIn)}
          ctaId="next"
          text="next"
          accessibilityHint="Go to the guardian dot com front page"
        />
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {

  return {
    onClick: (marketingPreferencesOptIn: boolean) => {
      dispatch(setMarketingPreferencesSelected());
      dispatch(sendMarketingPreferencesToIdentity(marketingPreferencesOptIn));
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
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MarketingConsent);
