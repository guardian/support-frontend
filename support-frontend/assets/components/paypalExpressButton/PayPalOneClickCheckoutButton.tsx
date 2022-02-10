import { css } from '@emotion/react';
import { space } from '@guardian/source-foundations';
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';
import GeneralErrorMessage from 'components/generalErrorMessage/generalErrorMessage';
import PayPalExpressButton from 'components/paypalExpressButton/PayPalExpressButton';
import { addressActionCreatorsFor } from 'components/subscriptionCheckouts/address/addressFieldsStore';
import type { Csrf } from 'helpers/csrf/csrfReducer';
import { setupSubscriptionPayPalPaymentWithShipping } from 'helpers/forms/paymentIntegrations/payPalRecurringCheckout';
import type {
	PayPalCheckoutDetails,
	PayPalUserDetails,
} from 'helpers/forms/paymentIntegrations/payPalRecurringCheckout';
import { PayPal } from 'helpers/forms/paymentMethods';
import { finalPrice } from 'helpers/productPrice/productPrices';
import type { Action } from 'helpers/subscriptionsForms/formActions';
import { formActionCreators } from 'helpers/subscriptionsForms/formActions';
import { onPaymentAuthorised } from 'helpers/subscriptionsForms/submit';
import type { CheckoutState } from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';
import 'redux';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import type { BillingPeriod } from 'helpers/productPrice/billingPeriods';
import { trackCheckoutSubmitAttempt } from 'helpers/tracking/behaviour';
import type { SubscriptionProduct } from 'helpers/productPrice/subscriptions';

type PropTypes = {
	onPayPalCheckoutCompleted: (...args: any[]) => any;
	csrf: Csrf;
	currencyId: IsoCurrency;
	hasLoaded: boolean;
	onClick: (...args: any[]) => any;
	billingPeriod: BillingPeriod;
	isTestUser: boolean;
	setupRecurringPayPalPayment: (...args: any[]) => any;
	amount: number;
	trackingId: string;
	product: SubscriptionProduct;
	submissionError: string;
	wasClicked: boolean;
};

const updateStore = (
	dispatch: Dispatch<Action>,
	payPalUserDetails: PayPalUserDetails,
) => {
	const { setEmail, setFirstName, setLastName } = formActionCreators;
	const { setAddressLineOne, setTownCity, setPostcode, setState, setCountry } =
		addressActionCreatorsFor('billing');
	// $FlowIgnore stoopid flow
	dispatch(setCountry(payPalUserDetails.shipToCountryCode));
	dispatch(setEmail(payPalUserDetails.email));
	dispatch(setFirstName(payPalUserDetails.firstName));
	dispatch(setLastName(payPalUserDetails.lastName));
	dispatch(setAddressLineOne(payPalUserDetails.shipToStreet));
	dispatch(setTownCity(payPalUserDetails.shipToCity));

	if (payPalUserDetails.shipToState) {
		dispatch(setState(payPalUserDetails.shipToState));
	}

	dispatch(setPostcode(payPalUserDetails.shipToZip));
};

function mapStateToProps(state: CheckoutState, ownProps) {
	return {
		hasLoaded: state.page.checkout.payPalHasLoaded,
		csrf: state.page.csrf,
		productPrices: state.page.checkout.productPrices,
		currencyId: state.common.internationalisation.currencyId,
		isTestUser: state.page.checkout.isTestUser,
		amount: finalPrice(
			state.page.checkout.productPrices,
			state.common.internationalisation.countryId,
			ownProps.billingPeriod,
		).price,
		submissionError: state.page.checkout.submissionError,
		wasClicked: state.page.checkout.billingPeriod === ownProps.billingPeriod,
	};
}

function mapDispatchToProps() {
	return {
		setupRecurringPayPalPayment: setupSubscriptionPayPalPaymentWithShipping,
		onPayPalCheckoutCompleted:
			(payPalCheckoutDetails: PayPalCheckoutDetails) =>
			(dispatch: Dispatch<Action>, getState: () => CheckoutState) => {
				if (payPalCheckoutDetails.user) {
					updateStore(dispatch, payPalCheckoutDetails.user);
				}

				onPaymentAuthorised(
					{
						paymentMethod: PayPal,
						token: payPalCheckoutDetails.baid,
					},
					dispatch,
					getState(),
				);
			},
		onClick:
			(billingPeriod, trackingId, product) => (dispatch: Dispatch<Action>) => {
				const componentId = `${trackingId}-${billingPeriod}-${product}-PayPal`;
				trackCheckoutSubmitAttempt(componentId, product, PayPal, product);
				return dispatch(formActionCreators.setBillingPeriod(billingPeriod));
			},
	};
}

const payPalButton = css`
	box-sizing: border-box;
	margin-top: ${space[3]}px;
`;

function PayPalOneClickCheckoutButton(props: PropTypes) {
	const submissionErrorHeading = 'Sorry there was a problem';
	const errorReason = props.submissionError && 'amazon_pay_fatal';
	return (
		<div css={payPalButton}>
			{props.wasClicked && (
				<GeneralErrorMessage
					errorReason={errorReason}
					errorHeading={submissionErrorHeading}
				/>
			)}
			<PayPalExpressButton
				onPayPalCheckoutCompleted={props.onPayPalCheckoutCompleted}
				csrf={props.csrf}
				currencyId={props.currencyId}
				hasLoaded={props.hasLoaded}
				canOpen={() => true}
				onClick={() =>
					props.onClick(props.billingPeriod, props.trackingId, props.product)
				}
				formClassName="form--contribution"
				isTestUser={props.isTestUser}
				setupRecurringPayPalPayment={props.setupRecurringPayPalPayment}
				amount={props.amount}
				billingPeriod={props.billingPeriod}
			/>
		</div>
	);
}

export default connect(
	mapStateToProps,
	mapDispatchToProps(),
)(PayPalOneClickCheckoutButton);
