// ----- Imports ----- //
import { connect } from 'react-redux';
import MarketingConsent from 'components/marketingConsent/marketingConsent';
import { sendTrackingEventsOnClick } from 'helpers/productPrice/subscriptions';
import type { Dispatch } from 'redux';
import type { Action } from 'helpers/user/userActions';
import type { Csrf as CsrfState } from 'helpers/csrf/csrfReducer';
import { sendMarketingPreferencesToIdentity } from 'components/marketingConsent/helpers';
import { getEmail } from 'helpers/subscriptionsForms/formFields';

const mapStateToProps = (state) => ({
	confirmOptIn: state.page.marketingConsent.confirmOptIn,
	email: getEmail(state),
	csrf: state.page.csrf,
});

function mapDispatchToProps(dispatch: Dispatch<Action>) {
	return {
		onClick: (email: string, csrf: CsrfState) => {
			sendTrackingEventsOnClick({
				id: 'marketing-permissions',
				componentType: 'ACQUISITIONS_OTHER',
			})();
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
