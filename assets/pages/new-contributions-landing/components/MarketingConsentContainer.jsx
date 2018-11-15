// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';
import MarketingConsent from 'components/marketingConsentNew/marketingConsent';
import { trackComponentClick } from 'helpers/tracking/ophanComponentEventTracking';
import type { Dispatch } from 'redux';
import type { Action } from 'helpers/user/userActions';
import type { Csrf as CsrfState } from 'helpers/csrf/csrfReducer';
import { sendMarketingPreferencesToIdentity } from 'components/marketingConsent/helpers';


const mapStateToProps = state => ({
  confirmOptIn: state.page.marketingConsent.confirmOptIn,
  email: state.page.form.formData.email,
  csrf: state.page.csrf,
});

function mapDispatchToProps(dispatch: Dispatch<Action>) {
  return {
    onClick: (email: string, csrf: CsrfState) => {
      trackComponentClick('marketing-permissions');
      sendMarketingPreferencesToIdentity(
        true, // it's TRUE because the button says Sign Me Up!
        email,
        dispatch,
        csrf,
        'MARKETING_CONSENT',
      );
    },
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(MarketingConsent);
