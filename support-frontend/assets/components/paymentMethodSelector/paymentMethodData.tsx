import {
	SvgCreditCard,
	SvgDirectDebitWide,
	SvgPayPalBrand,
} from '@guardian/source-react-components';
import type { SepaFormProps } from 'components/sepaForm/SepaForm';
import { SepaForm } from 'components/sepaForm/SepaForm';
import { SepaFormContainer } from 'components/sepaForm/SepaFormContainer';
import { StripeCardFormContainer } from 'components/stripeCardForm/stripeCardFormContainer';
import SvgAmazonPayLogoDs from 'components/svgs/amazonPayLogoDs';
import SvgSepa from 'components/svgs/sepa';
import type { PaymentMethod } from 'helpers/forms/paymentMethods';

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
		icon: <SvgCreditCard />,
		accordionBody: () => <StripeCardFormContainer />,
	},
	PayPal: {
		id: 'qa-paypal',
		label: 'PayPal',
		icon: <SvgPayPalBrand />,
	},
	DirectDebit: {
		id: 'qa-direct-debit',
		label: 'Direct debit',
		icon: <SvgDirectDebitWide />,
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
	AmazonPay: {
		id: 'qa-amazon-pay',
		label: 'Amazon Pay',
		icon: <SvgAmazonPayLogoDs />,
	},
	ExistingCard: {
		id: 'qa-existing-card',
		label: 'Credit/Debit card',
		icon: <SvgCreditCard />,
	},
	ExistingDirectDebit: {
		id: 'qa-existing-direct-debit',
		label: 'Direct Debit',
		icon: <SvgDirectDebitWide />,
	},
	None: {
		id: 'qa-none',
		label: 'Other Payment Method',
		icon: <SvgCreditCard />,
	},
};
