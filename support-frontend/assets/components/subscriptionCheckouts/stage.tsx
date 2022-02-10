// ----- Imports ----- //
import type { ReactNode } from 'react';
import { connect } from 'react-redux';
import ProgressMessage from 'components/progressMessage/progressMessage';
import type { SubscriptionProduct } from 'helpers/productPrice/subscriptions';
import type { Stage } from 'helpers/subscriptionsForms/formFields';
import 'helpers/subscriptionsForms/formFields';
import 'helpers/productPrice/subscriptions';
import type { WithDeliveryCheckoutState } from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';
import ReturnSection from './thankYou/returnSection';

// ----- Types ----- //
type PropTypes = {
	stage: Stage;
	formSubmitted: boolean;
};
type StagePropTypes = {
	stage: Stage;
	formSubmitted: boolean;
	checkoutForm: ReactNode;
	thankYouContentPending: ReactNode;
	thankYouContent: ReactNode;
	subscriptionProduct: SubscriptionProduct;
};

// ----- State/Props Maps ----- //
function mapStateToProps(state: WithDeliveryCheckoutState): PropTypes {
	return {
		stage: state.page.checkout.stage,
		formSubmitted: state.page.checkout.formSubmitted,
	};
}

// ----- Component ----- //
function CheckoutStage(props: StagePropTypes) {
	switch (props.stage) {
		case 'thankyou':
			return (
				<div>
					{props.thankYouContent}
					<ReturnSection subscriptionProduct={props.subscriptionProduct} />
				</div>
			);

		case 'thankyou-pending':
			return (
				<div>
					{props.thankYouContentPending}
					<ReturnSection subscriptionProduct={props.subscriptionProduct} />
				</div>
			);

		case 'checkout':
		default:
			return (
				<div className="checkout-content">
					{props.checkoutForm}
					{props.formSubmitted ? (
						<ProgressMessage
							message={['Processing transaction', 'Please wait']}
						/>
					) : null}
				</div>
			);
	}
} // ----- Export ----- //

export default connect(mapStateToProps)(CheckoutStage);
