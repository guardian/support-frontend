import { Elements } from '@stripe/react-stripe-js';
import { useStripeAccount } from 'helpers/forms/stripe';

// type PaymentRequestStatus = 'NOT_LOADED' | 'NOT_AVAILABLE' | 'AVAILABLE';

type StripeElementsProps = {
	stripeKey: string;
	children: React.ReactNode;
};

export function StripeElements({
	stripeKey,
	children,
}: StripeElementsProps): JSX.Element {
	const stripeSdk = useStripeAccount(stripeKey);

	// `options` must be set even if it's empty, otherwise we get 'Unsupported prop change on Elements' warnings
	// in the console
	const elementsOptions = {};

	return (
		<Elements stripe={stripeSdk} options={elementsOptions}>
			{children}
		</Elements>
	);
}
