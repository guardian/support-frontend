// @flow

// ----- Imports ----- //

import { connect } from 'react-redux';
import MarketingConsent from 'components/marketingConsentNew/marketingConsent';
import { trackComponentClick } from 'helpers/tracking/ophanComponentEventTracking';
import type { Dispatch } from 'redux';
import type { Action } from 'helpers/user/userActions';
import { sendMarketingPreferencesToIdentity } from 'components/marketingConsent/helpers';


const mapStateToProps = state => ({
  confirmOptIn: state.page.marketingConsent.confirmOptIn,
  email: state.page.form.formData.email,
  error: state.page.marketingConsent.error,
  requestPending: state.page.marketingConsent.requestPending,
});

function mapDispatchToProps(dispatch: Dispatch<Action>) {
  return {
    onClick: (email: string) => {
      trackComponentClick('marketing-permissions');
      sendMarketingPreferencesToIdentity(
        true, // it's TRUE because the button says Sign Me Up!
        email,
        dispatch,
        'MARKETING_CONSENT',
      );
    },
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(MarketingConsent);
