import { connect } from 'react-redux';
import type { RedemptionPageState } from 'helpers/redux/redemptionsStore';
import ThankYouContent from 'pages/subscriptions-redemption/thankYouContent';

function mapStateToProps(state: RedemptionPageState) {
	return {
		countryGroupId: state.common.internationalisation.countryGroupId,
		paymentMethod: null,
		includePaymentCopy: false,
	};
}

export default connect(mapStateToProps)(ThankYouContent);
