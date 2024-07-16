import { Elements } from '@stripe/react-stripe-js';
import type { StripeElementsOptions } from '@stripe/stripe-js';
import { useStripeAccount } from 'helpers/forms/stripe';

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
	const elementsOptions = {
		mode: 'payment',
		amount: 100,
		currency: 'gbp',
	} as StripeElementsOptions;
	console.log('elem:', elementsOptions);
	return (
		<Elements stripe={stripeSdk} options={elementsOptions}>
			{children}
		</Elements>
	);
}
