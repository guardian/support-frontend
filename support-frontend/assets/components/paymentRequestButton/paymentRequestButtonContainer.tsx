import {
	PaymentRequestButtonElement,
	useStripe,
} from '@stripe/react-stripe-js';
import type { PaymentRequest, Stripe as StripeJs } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { toHumanReadableContributionType } from 'helpers/forms/checkouts';
import { getContributionType } from 'helpers/redux/checkout/product/selectors/productType';
import { useContributionsSelector } from 'helpers/redux/storeHooks';
import { PaymentRequestButton } from './paymentRequestButton';

type PaymentRequestButtonType = 'APPLE_PAY' | 'GOOGLE_PAY' | 'PAY_NOW' | 'NONE';

function usePaymentRequest(
	stripe: StripeJs | null,
): [PaymentRequestButtonType, PaymentRequest | null] {
	const [paymentRequest, setPaymentRequest] = useState<PaymentRequest | null>(
		null,
	);
	const [paymentType, setPaymentType] =
		useState<PaymentRequestButtonType>('NONE');

	const { countryId, currencyId } = useContributionsSelector(
		(state) => state.common.internationalisation,
	);
	const contributionType = useContributionsSelector(getContributionType);
	const amount = useContributionsSelector(
		(state) =>
			state.page.checkoutForm.product.selectedAmounts[contributionType],
	);

	useEffect(() => {
		if (stripe) {
			const paymentRequestSdk = stripe.paymentRequest({
				country: countryId,
				currency: currencyId,
				total: {
					label: `${toHumanReadableContributionType(
						contributionType,
					)} Contribution`,
					amount: amount * 100,
				},
				requestPayerEmail: true,
				requestPayerName: contributionType !== 'ONE_OFF',
			});

			void paymentRequestSdk.canMakePayment().then((result) => {
				if (result) {
					setPaymentRequest(paymentRequestSdk);

					if (result.applePay) {
						setPaymentType('APPLE_PAY');
					} else if (result.googlePay) {
						setPaymentType('GOOGLE_PAY');
					} else {
						setPaymentType('PAY_NOW');
					}
				}
			});
		}
	}, [stripe]);

	return [paymentType, paymentRequest];
}

type PaymentRequestButtonContainerProps = {
	customButton: React.ReactNode;
};

function Button(props: PaymentRequestButtonContainerProps): JSX.Element | null {
	const stripe = useStripe();
	const [paymentType, paymentRequest] = usePaymentRequest(stripe);

	if (paymentRequest && paymentType === 'PAY_NOW') {
		return <>{props.customButton}</>;
	} else if (paymentRequest && paymentType !== 'NONE') {
		return <PaymentRequestButtonElement options={{ paymentRequest }} />;
	}
	return null;
}

export function PaymentRequestButtonContainer(
	props: PaymentRequestButtonContainerProps,
): JSX.Element {
	return (
		<PaymentRequestButton
			button={<Button customButton={props.customButton} />}
		/>
	);
}
