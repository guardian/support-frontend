// ----- Imports ----- //
import * as React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import AnimatedDots from 'components/spinners/animatedDots';
import type {
	PayPalCheckoutDetails,
	SetupPayPalRequestType,
} from 'helpers/forms/paymentIntegrations/payPalRecurringCheckout';
import { getPayPalOptions } from 'helpers/forms/paymentIntegrations/payPalRecurringCheckout';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import type { BillingPeriod } from 'helpers/productPrice/billingPeriods';
import type { CsrfState } from 'helpers/redux/checkout/csrf/state';
import { updatePayPalButtonReady } from 'helpers/redux/checkout/payment/payPal/actions';

type PropTypes = {
	onPayPalCheckoutCompleted: (
		payPalCheckoutDetails: PayPalCheckoutDetails,
	) => void;
	csrf: CsrfState;
	currencyId: IsoCurrency;
	hasLoaded: boolean;
	canOpen: () => boolean;
	onClick: () => void;
	formClassName: string;
	isTestUser: boolean;
	amount: number;
	billingPeriod: BillingPeriod;
	setupRecurringPayPalPayment: SetupPayPalRequestType;
	updatePayPalButtonReady: (ready: boolean) => void; // created in mapDispatchToProps should not be passed into the component
};

const mapDispatchToProps = {
	updatePayPalButtonReady,
};

function PayPalExpressButtonComponent(props: PropTypes) {
	// hasLoaded determines whether window.paypal is available
	if (!props.hasLoaded) {
		return <AnimatedDots appearance="dark" />;
	}

	const paypalOptions = getPayPalOptions(
		props.currencyId,
		props.csrf,
		props.onPayPalCheckoutCompleted,
		props.canOpen,
		props.onClick,
		props.formClassName,
		props.isTestUser,
		props.amount,
		props.billingPeriod,
		props.setupRecurringPayPalPayment,
		props.updatePayPalButtonReady,
	);
	// This element contains an iframe which contains the actual button
	return React.createElement(
		window.paypal.Button.driver('react', {
			React,
			ReactDOM,
		}),
		paypalOptions,
	);
}

const PayPalExpressButton = connect(
	null,
	mapDispatchToProps,
)(PayPalExpressButtonComponent);
export default PayPalExpressButton;
