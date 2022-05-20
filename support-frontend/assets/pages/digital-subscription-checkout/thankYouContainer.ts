import { connect } from 'react-redux';
import { getFormFields } from 'helpers/subscriptionsForms/formFields';
import type { CheckoutState } from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';
import ThankYouContent from 'pages/digital-subscription-checkout/thankYouContent';

export default connect((state: CheckoutState) => ({
	...getFormFields(state),
	includePaymentCopy: true,
	participations: state.common.abParticipations,
}))(ThankYouContent);
