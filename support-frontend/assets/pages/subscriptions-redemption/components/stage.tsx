// ----- Imports ----- //
import type { ReactNode } from 'react';
import React from 'react';
import type { ConnectedProps } from 'react-redux';
import { connect } from 'react-redux';
import ProgressMessage from 'components/progressMessage/progressMessage';
import ReturnSection from 'components/subscriptionCheckouts/thankYou/returnSection';
import { DigitalPack } from 'helpers/productPrice/subscriptions';
import type { RedemptionPageState } from 'pages/subscriptions-redemption/subscriptionsRedemptionReducer';

// ----- State/Props Maps ----- //
function mapStateToProps(state: RedemptionPageState) {
	return {
		stage: state.page.checkout.stage,
		userCode: state.page.userCode,
		readerType: state.page.readerType,
		user: state.page.user,
		currencyId: state.common.internationalisation.currencyId,
		countryId: state.common.internationalisation.countryId,
		participations: state.common.abParticipations,
		csrf: state.page.csrf,
		firstName: state.page.checkout.firstName,
		lastName: state.page.checkout.lastName,
		email: state.page.checkout.email,
		telephone: state.page.checkout.telephone,
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
					<ReturnSection subscriptionProduct={DigitalPack} />
				</div>
			);

		case 'thankyou-pending':
			return (
				<div>
					{props.thankYouContentPending}
					<ReturnSection subscriptionProduct={DigitalPack} />
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
