import { connect } from 'react-redux';
import { sendMarketingPreferencesToIdentity } from 'components/marketingConsent/helpers';
import MarketingConsent from 'components/marketingConsent/marketingConsent';
import { sendTrackingEventsOnClick } from 'helpers/productPrice/subscriptions';
import type { CsrfState } from 'helpers/redux/checkout/csrf/state';
import type {
	RedemptionDispatch,
	RedemptionPageState,
} from 'helpers/redux/redemptionsStore';

const mapStateToProps = (state: RedemptionPageState) => ({
	confirmOptIn: state.page.checkoutForm.marketingConsent.confirmOptIn,
	email: state.page.checkoutForm.personalDetails.email,
	csrf: state.page.checkoutForm.csrf,
	error: state.page.checkoutForm.marketingConsent.requestPending,
	requestPending: state.page.checkoutForm.marketingConsent.requestPending,
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
			);
		},
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(MarketingConsent);
