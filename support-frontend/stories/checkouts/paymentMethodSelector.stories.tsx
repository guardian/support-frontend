import { css } from '@emotion/react';
import { space } from '@guardian/source-foundations';
import { Elements } from '@stripe/react-stripe-js';
import { useState } from 'react';
import type { PaymentMethodSelectorProps } from 'components/paymentMethodSelector/paymentMethodSelector';
import { PaymentMethodSelector } from 'components/paymentMethodSelector/paymentMethodSelector';
import type { PaymentMethod } from 'helpers/forms/paymentMethods';
import {
	AmazonPay,
	DirectDebit,
	PayPal,
	Sepa,
	Stripe,
} from 'helpers/forms/paymentMethods';

export default {
	title: 'Checkouts/PaymentMethodSelector',
	component: PaymentMethodSelector,
	decorators: [
		(Story: React.FC): JSX.Element => {
			return (
				<Elements stripe={null}>
					<Story />
				</Elements>
			);
		},
	],
};

function Template(args: Partial<PaymentMethodSelectorProps>): JSX.Element {
	const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('None');

	const availablePaymentMethods: PaymentMethod[] = [
		DirectDebit,
		Sepa,
		Stripe,
		PayPal,
		AmazonPay,
	];

	return (
		<div
			css={css`
				max-width: 500px;
				padding: ${space[6]}px;
			`}
		>
			<PaymentMethodSelector
				availablePaymentMethods={availablePaymentMethods}
				paymentMethod={paymentMethod}
				validationError={args.validationError}
				existingPaymentMethodList={[
					{
						paymentType: 'Card',
						billingAccountId: '12345',
						subscriptions: [
							{
								billingAccountId: '12345',
								isCancelled: false,
								isActive: true,
								name: 'Guardian Weekly',
							},
						],
						card: '0123',
					},
				]}
				onSelectPaymentMethod={(paymentMethod) =>
					setPaymentMethod(paymentMethod)
				}
			/>
		</div>
	);
}

Template.args = {} as Partial<PaymentMethodSelectorProps>;
Template.decorators = [] as unknown[];

export const Default = Template.bind({});

export const WithError = Template.bind({});

WithError.args = {
	validationError: 'Please select a payment method',
};
