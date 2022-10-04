import {
	PaymentRequestButtonElement,
	useStripe,
} from '@stripe/react-stripe-js';
import type { PaymentRequest, Stripe as StripeJs } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { ContributionsStripe } from 'components/stripe/contributionsStripe';
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
				currency: currencyId.toLowerCase(),
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

type CustomButtonProps = {
	onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

type PaymentRequestButtonContainerProps = {
	CustomButton: React.FC<CustomButtonProps>;
};

function Button({
	CustomButton,
}: PaymentRequestButtonContainerProps): JSX.Element | null {
	const stripe = useStripe();
	const [paymentType, paymentRequest] = usePaymentRequest(stripe);

	if (paymentRequest && paymentType === 'PAY_NOW') {
		return <CustomButton onClick={() => console.log('clicked')} />;
	} else if (paymentRequest && paymentType !== 'NONE') {
		return <PaymentRequestButtonElement options={{ paymentRequest }} />;
	}
	return null;
}

function getButtonForPaymentType(
	paymentType: PaymentRequestButtonType,
	paymentRequest: PaymentRequest,
	customButton: JSX.Element,
) {
	if (paymentType === 'PAY_NOW') {
		return customButton;
	} else if (paymentType !== 'NONE') {
		return <PaymentRequestButtonElement options={{ paymentRequest }} />;
	}
	return null;
}

function PaymentRequestButtonProvider({
	CustomButton,
}: PaymentRequestButtonContainerProps) {
	const stripe = useStripe();
	const [paymentType, paymentRequest] = usePaymentRequest(stripe);

	const button = paymentRequest
		? getButtonForPaymentType(
				paymentType,
				paymentRequest,
				<CustomButton onClick={() => console.log('clicked')} />,
		  )
		: null;

	return <PaymentRequestButton button={button} />;
}

export function PaymentRequestButtonContainer({
	CustomButton,
}: PaymentRequestButtonContainerProps): JSX.Element {
	return (
		<ContributionsStripe>
			<PaymentRequestButtonProvider CustomButton={CustomButton} />
		</ContributionsStripe>
	);
}
