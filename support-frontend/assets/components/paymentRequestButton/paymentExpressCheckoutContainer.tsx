import { useStripe } from '@stripe/react-stripe-js';
import { usePaymentRequest } from './hooks/usePaymentRequest';
import { usePaymentRequestCompletion } from './hooks/usePaymentRequestCompletion';
import { usePaymentRequestEvent } from './hooks/usePaymentRequestEvent';
import { PaymentRequestButton } from './paymentRequestButton';

type CustomButtonProps = {
	onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

type PaymentRequestButtonContainerProps = {
	CustomButton: React.FC<CustomButtonProps>;
};

// Migrate to the Express Checkout Element
// https://docs.stripe.com/elements/express-checkout-element/migration?client=react

export function paymentExpressCheckoutContainer({
	CustomButton,
}: PaymentRequestButtonContainerProps): JSX.Element | null {
	console.log(CustomButton);

	// Setup Stripe
	const stripe = useStripe();

	// Construct Stripe PaymentRequest
	const { buttonType, paymentRequest, internalPaymentMethodName } =
		usePaymentRequest(stripe);

	//
	const paymentEventDetails = usePaymentRequestEvent(paymentRequest);
	usePaymentRequestCompletion(
		stripe,
		internalPaymentMethodName,
		paymentEventDetails,
	);

	// function onClick() {
	// 	// const options = {
	// 	// 	emailRequired: true,
	// 	// };
	// 	// resolve(options);
	// }

	// function onConfirm() {}

	if (paymentRequest) {
		if (buttonType === 'APPLE_PAY' || buttonType !== 'GOOGLE_PAY') {
			return (
				<PaymentRequestButton children={undefined}>
					{/* <ExpressCheckoutElement onClick={onClick} onConfirm={onConfirm} /> */}
				</PaymentRequestButton>
			);
		}
	}
	return null;
}
