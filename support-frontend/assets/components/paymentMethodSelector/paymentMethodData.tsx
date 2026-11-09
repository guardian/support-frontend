import { SvgDirectDebit } from '@guardian/source/react-components';
import type { PaymentMethod } from 'helpers/forms/paymentMethods';
import { CreditDebitIcons, SvgCreditCardWithTheme } from './creditDebitIcons';
import { PaypalIcon } from './paypalIcon';

interface PaymentMethodData {
	id: string;
	label: string;
	icon?: JSX.Element;
}

export const paymentMethodData: Record<
	PaymentMethod | 'StripeExpressCheckoutElement',
	PaymentMethodData
> = {
	Stripe: {
		id: 'qa-credit-card',
		label: 'Credit/Debit card',
		icon: <CreditDebitIcons />,
	},
	StripeHostedCheckout: {
		id: 'qa-stripe-hosted-checkout',
		label: 'Credit/Debit card',
		icon: <CreditDebitIcons />,
	},
	PayPal: {
		id: 'qa-paypal',
		label: 'PayPal',
		icon: <PaypalIcon />,
	},
	PayPalCompletePayments: {
		id: 'qa-paypal-complete-payments',
		label: 'PayPal',
		icon: <PaypalIcon />,
	},
	DirectDebit: {
		id: 'qa-direct-debit',
		label: 'Direct debit',
		icon: <SvgDirectDebit size="medium" />,
	},
	None: {
		id: 'qa-none',
		label: 'Other Payment Method',
		icon: <SvgCreditCardWithTheme />,
	},
	/**
	 * The Stripe ExpressCheckoutElement is currently only offered as a
	 * selectable payment method for Apple Pay.
	 * TODO - add an Apple Pay mark once we have one we're licensed to use.
	 */
	StripeExpressCheckoutElement: {
		id: 'qa-apple-pay',
		label: 'Apple Pay',
	},
};
