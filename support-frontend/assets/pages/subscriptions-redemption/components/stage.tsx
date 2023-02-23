// ----- Imports ----- //
import type { ReactNode } from 'react';
import type { ConnectedProps } from 'react-redux';
import { connect } from 'react-redux';
import ProgressMessage from 'components/progressMessage/progressMessage';
import ReturnSection from 'components/subscriptionCheckouts/thankYou/returnSection';
import { DigitalPackAddOn } from 'helpers/productPrice/subscriptions';
import type { RedemptionPageState } from 'helpers/redux/redemptionsStore';

// ----- State/Props Maps ----- //
function mapStateToProps(state: RedemptionPageState) {
	return {
		stage: state.page.checkout.stage,
	};
}

const connector = connect(mapStateToProps);

type PropTypes = ConnectedProps<typeof connector> & {
	checkoutForm: ReactNode;
	thankYouContentPending: ReactNode;
	thankYouContent: ReactNode;
};

// ----- Component ----- //
function CheckoutStage(props: PropTypes) {
	switch (props.stage) {
		case 'thankyou':
			return (
				<div>
					{props.thankYouContent}
					<ReturnSection subscriptionProduct={DigitalPackAddOn} />
				</div>
			);

		case 'thankyou-pending':
			return (
				<div>
					{props.thankYouContentPending}
					<ReturnSection subscriptionProduct={DigitalPackAddOn} />
				</div>
			);

		case 'processing':
			return (
				<div className="checkout-content">
					{props.checkoutForm}
					<ProgressMessage
						message={['Processing transaction', 'Please wait']}
					/>
				</div>
			);

		default:
			return <div className="checkout-content">{props.checkoutForm}</div>;
	}
} // ----- Export ----- //

export default connector(CheckoutStage);
