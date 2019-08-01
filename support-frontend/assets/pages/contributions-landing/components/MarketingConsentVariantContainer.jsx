// @flow

// ----- Imports ----- //

import { connect } from 'react-redux';
import MarketingConsentWithCheckbox from 'components/marketingConsent/marketingConsentWithCheckbox';
import { trackComponentClick } from 'helpers/tracking/behaviour';
import type { Dispatch } from 'redux';
import type { Action } from 'helpers/user/userActions';
import type { Csrf as CsrfState } from 'helpers/csrf/csrfReducer';
import { sendMarketingPreferencesToIdentity } from 'components/marketingConsent/helpers';
import type { ThankYouPageMarketingComponentTestVariants } from 'helpers/abTests/abtestDefinitions';


const mapStateToProps = state => ({
  confirmOptIn: state.page.marketingConsent.confirmOptIn,
  email: state.page.form.formData.email,
  csrf: state.page.csrf,
  error: state.page.marketingConsent.error,
  requestPending: state.page.marketingConsent.requestPending,
  marketingComponentVariant: state.common.abParticipations.thankYouPageMarketingComponent,
});

function mapDispatchToProps(dispatch: Dispatch<Action>) {
  return {
    onClick: (
      email: string,
      csrf: CsrfState,
      marketingComponentVariant?: ThankYouPageMarketingComponentTestVariants,
    ) => {
      trackComponentClick('marketing-permissions');
      if (marketingComponentVariant && marketingComponentVariant !== 'notintest') {
        trackComponentClick(`marketing-permissions-abtest-${marketingComponentVariant}`);
      }
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
