// @flow

// ----- Imports ----- //

import { connect } from 'react-redux';
import MarketingConsentWithCheckbox from 'components/marketingConsent/marketingConsentWithCheckbox';
import { trackComponentClick } from 'helpers/tracking/behaviour';
import type { Dispatch } from 'redux';
import type { Action } from 'helpers/user/userActions';
import type { Csrf as CsrfState } from 'helpers/csrf/csrfReducer';
import { sendMarketingPreferencesToIdentity } from 'components/marketingConsent/helpers';

const mapStateToProps = state => ({
  confirmOptIn: state.page.marketingConsent.confirmOptIn,
  email: state.page.form.formData.email,
  csrf: state.page.csrf,
  error: state.page.marketingConsent.error,
  requestPending: state.page.marketingConsent.requestPending,
  countryGroupId: state.common.internationalisation.countryGroupId,
  contributionType: state.page.form.contributionType,
});

function mapDispatchToProps(dispatch: Dispatch<Action>) {
  return {
    onClick: (
      email: string,
      csrf: CsrfState,
    ) => {
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

export default connect(mapStateToProps, mapDispatchToProps)(MarketingConsentWithCheckbox);
