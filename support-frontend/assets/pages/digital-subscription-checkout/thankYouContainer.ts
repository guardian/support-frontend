import { connect } from 'react-redux';
import type { SubscriptionsState } from 'helpers/redux/subscriptionsStore';
import { getFormFields } from 'helpers/subscriptionsForms/formFields';
import ThankYouContent from 'pages/digital-subscription-checkout/thankYouContent';

export default connect((state: SubscriptionsState) => ({
	...getFormFields(state),
	includePaymentCopy: true,
	participations: state.common.abParticipations,
}))(ThankYouContent);
