import { css } from '@emotion/react';
import { space } from '@guardian/source-foundations';
import { Elements } from '@stripe/react-stripe-js';
import { Provider } from 'react-redux';
import { createTestStoreForContributions } from '__test-utils__/testStore';
import { PaymentMethodSelector } from 'components/paymentMethodSelector/paymentMethodSelector';
import type { PaymentMethod } from 'helpers/forms/paymentMethods';
import {
	AmazonPay,
	DirectDebit,
	ExistingCard,
	ExistingDirectDebit,
	PayPal,
	Sepa,
	Stripe,
} from 'helpers/forms/paymentMethods';
import { setPaymentMethod } from 'helpers/redux/checkout/payment/paymentMethod/actions';
import { setProductType } from 'helpers/redux/checkout/product/actions';
import { setCountryInternationalisation } from 'helpers/redux/commonState/actions';

export default {
	title: 'Checkouts/PaymentMethodSelector',
	component: PaymentMethodSelector,
	argTypes: {
		paymentMethod: {
			control: {
				type: 'radio',
				options: [
					Stripe,
					PayPal,
					DirectDebit,
					Sepa,
					ExistingCard,
					ExistingDirectDebit,
					AmazonPay,
				],
			},
		},
	},
};

function Template(args: { paymentMethod: PaymentMethod }): JSX.Element {
	const availablePaymentMethods: PaymentMethod[] = [
		Stripe,
		PayPal,
		DirectDebit,
		Sepa,
		ExistingCard,
		ExistingDirectDebit,
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
				paymentMethod={args.paymentMethod}
				validationError={undefined}
				existingPaymentMethods={[]}
				fullExistingPaymentMethods={[]}
			/>
		</div>
	);
}

Template.args = {} as Record<string, unknown>;
Template.decorators = [] as unknown[];

export const Default = Template.bind({});

Default.args = {
	paymentMethod: 'DirectDebit',
};

Default.decorators = [
	(Story: React.FC, args: { paymentMethod: PaymentMethod }): JSX.Element => {
		const store = createTestStoreForContributions();

		store.dispatch(setPaymentMethod(args.paymentMethod));
		store.dispatch(setCountryInternationalisation('GB'));
		store.dispatch(setProductType('MONTHLY'));

		return (
			<Provider store={store}>
				<Elements stripe={null}>
					<Story />
				</Elements>
			</Provider>
		);
	},
];
