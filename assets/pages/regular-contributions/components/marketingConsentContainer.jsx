// @flow

// ----- Imports ----- //

import { connect } from 'react-redux';
import type { Dispatch } from 'redux';

import { type Action } from 'helpers/user/userActions';
import { defaultUserActionFunctions } from 'helpers/user/defaultUserActionFunctions';
import { sendMarketingPreferencesToIdentity } from 'components/marketingConsent/helpers';
import MarketingConsent from 'components/marketingConsent/marketingConsent';
import { trackComponentClick } from 'helpers/tracking/ophanComponentEventTracking';

import type { Csrf as CsrfState } from 'helpers/csrf/csrfReducer';
import { type State } from '../regularContributionsReducer';

// ----- Component ----- //

function mapDispatchToProps(dispatch: Dispatch<Action>) {

  const { setGnmMarketing } = defaultUserActionFunctions;

  return {
    onClick: (marketingPreferencesOptIn: boolean, email: string, csrf: CsrfState) => {
      trackComponentClick('marketing-permissions-old-flow');
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

function mapStateToProps(state: State) {
  return {
    email: state.page.user.email,
    marketingPreferencesOptIn: state.page.user.gnmMarketing,
    consentApiError: state.page.marketingConsent.error,
    confirmOptIn: state.page.marketingConsent.confirmOptIn,
    csrf: state.page.csrf,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MarketingConsent);
