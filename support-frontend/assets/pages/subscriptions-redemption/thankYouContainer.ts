import { connect } from 'react-redux';
import ThankYouContent from 'pages/digital-subscription-checkout/thankYouContent';
import type { RedemptionPageState } from 'pages/subscriptions-redemption/subscriptionsRedemptionReducer';

function mapStateToProps(state: RedemptionPageState) {
	return {
		countryGroupId: state.common.internationalisation.countryGroupId,
		paymentMethod: null,
		includePaymentCopy: false,
	};
}

export default connect(mapStateToProps)(ThankYouContent);
