import { connect } from 'react-redux';
import { sendMarketingPreferencesToIdentity } from 'components/marketingConsent/helpers';
import MarketingConsent from 'components/marketingConsent/marketingConsent';
import type { Csrf as CsrfState } from 'helpers/csrf/csrfReducer';
import { sendTrackingEventsOnClick } from 'helpers/productPrice/subscriptions';
import type {
	RedemptionDispatch,
	RedemptionPageState,
} from 'helpers/redux/redemptionsStore';

const mapStateToProps = (state: RedemptionPageState) => ({
	confirmOptIn: state.page.marketingConsent.confirmOptIn,
	email: state.page.checkoutForm.personalDetails.email,
	csrf: state.page.csrf,
	error: state.page.marketingConsent.requestPending,
	requestPending: state.page.marketingConsent.requestPending,
});

function mapDispatchToProps(dispatch: RedemptionDispatch) {
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
