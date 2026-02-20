import { SvgDirectDebit } from '@guardian/source/react-components';
import SvgSepa from 'components/svgs/sepa';
import type { PaymentMethod } from 'helpers/forms/paymentMethods';
import { CreditDebitIcons, SvgCreditCardWithTheme } from './creditDebitIcons';
import { PaypalIcon } from './paypalIcon';

interface PaymentMethodData {
	id: string;
	label: string;
	icon: JSX.Element;
}

export const paymentMethodData: Record<PaymentMethod, PaymentMethodData> = {
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
	Sepa: {
		id: 'qa-direct-debit-sepa',
		label: 'Direct debit (SEPA)',
		icon: <SvgSepa />,
	},
	None: {
		id: 'qa-none',
		label: 'Other Payment Method',
		icon: <SvgCreditCardWithTheme />,
	},
};
