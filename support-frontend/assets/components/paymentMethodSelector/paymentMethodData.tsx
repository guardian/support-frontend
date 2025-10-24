import { SvgDirectDebit } from '@guardian/source/react-components';
import type { DirectDebitFormProps } from 'components/directDebit/directDebitForm/directDebitForm';
import DirectDebitForm from 'components/directDebit/directDebitForm/directDebitForm';
import { DirectDebitFormContainer } from 'components/directDebit/directDebitForm/directDebitFormContainer';
import type { SepaFormProps } from 'components/sepaForm/SepaForm';
import { SepaForm } from 'components/sepaForm/SepaForm';
import { SepaFormContainer } from 'components/sepaForm/SepaFormContainer';
import { StripeCardFormContainer } from 'components/stripeCardForm/stripeCardFormContainer';
import SvgSepa from 'components/svgs/sepa';
import type { PaymentMethod } from 'helpers/forms/paymentMethods';
import { CreditDebitIcons, SvgCreditCardWithTheme } from './creditDebitIcons';
import { PaypalIcon } from './paypalIcon';

interface PaymentMethodData {
	id: string;
	label: string;
	icon: JSX.Element;
	accordionBody?: () => JSX.Element;
}

export const paymentMethodData: Record<PaymentMethod, PaymentMethodData> = {
	Stripe: {
		id: 'qa-credit-card',
		label: 'Credit/Debit card',
		icon: <CreditDebitIcons />,
		accordionBody: () => <StripeCardFormContainer />,
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
		label: 'PayPal (Complete Payments)', // TODO: change label, but this is useful for testing
		icon: <PaypalIcon />,
	},
	DirectDebit: {
		id: 'qa-direct-debit',
		label: 'Direct debit',
		icon: <SvgDirectDebit size="medium" />,
		// TODO: Currently only in use for styling purposes
		accordionBody: () => (
			<DirectDebitFormContainer
				render={(ddFormProps: DirectDebitFormProps) => (
					<DirectDebitForm {...ddFormProps} />
				)}
			/>
		),
	},
	Sepa: {
		id: 'qa-direct-debit-sepa',
		label: 'Direct debit (SEPA)',
		icon: <SvgSepa />,
		accordionBody: () => (
			<SepaFormContainer
				render={(sepaFormProps: SepaFormProps) => (
					<SepaForm {...sepaFormProps} />
				)}
			/>
		),
	},
	None: {
		id: 'qa-none',
		label: 'Other Payment Method',
		icon: <SvgCreditCardWithTheme />,
	},
};
