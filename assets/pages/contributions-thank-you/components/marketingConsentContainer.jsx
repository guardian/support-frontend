// @flow

// ----- Imports ----- //

import { connect } from 'react-redux';

import { setGnmMarketing } from 'helpers/user/userActions';
import { sendMarketingPreferencesToIdentity } from 'containerisableComponents/marketingConsent/helpers';
import MarketingConsent from 'containerisableComponents/marketingConsent/marketingConsent';

import type { Csrf as CsrfState } from 'helpers/csrf/csrfReducer';


// ----- Component ----- //


function mapDispatchToProps(dispatch) {
  return {
    onClick: (marketingPreferencesOptIn: boolean, email: string, csrf: CsrfState) => {
      sendMarketingPreferencesToIdentity(
        marketingPreferencesOptIn,
        email,
        dispatch,
        csrf,
        'CONTRIBUTIONS_THANK_YOU',
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
    consentApiError: state.page.marketingConsent.error,
    confirmOptIn: state.page.marketingConsent.confirmOptIn,
    csrf: state.page.csrf,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MarketingConsent);
