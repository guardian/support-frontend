import {
	PaymentRequestButtonElement,
	useStripe,
} from '@stripe/react-stripe-js';
import { Stripe } from 'helpers/forms/paymentMethods';
import { setPaymentMethod } from 'helpers/redux/checkout/payment/paymentMethod/actions';
import { useContributionsDispatch } from 'helpers/redux/storeHooks';
import { trackComponentClick } from 'helpers/tracking/behaviour';
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

export function PaymentRequestButtonContainer({
	CustomButton,
}: PaymentRequestButtonContainerProps): JSX.Element | null {
	const stripe = useStripe();

	const { buttonType, paymentRequest, internalPaymentMethodName } =
		usePaymentRequest(stripe);
	const paymentEventDetails = usePaymentRequestEvent(paymentRequest);
	usePaymentRequestCompletion(
		stripe,
		internalPaymentMethodName,
		paymentEventDetails,
	);

	const dispatch = useContributionsDispatch();

	function handleButtonClick() {
		// TODO: VALIDATE OTHER AMOUNT FIELD HERE
		trackComponentClick('apple-pay-clicked');
		dispatch(setPaymentMethod(Stripe));
	}

	if (paymentRequest) {
		if (buttonType === 'PAY_NOW') {
			return (
				<PaymentRequestButton>
					<CustomButton
						onClick={() => {
							handleButtonClick();
							paymentRequest.show();
						}}
					/>
				</PaymentRequestButton>
			);
		} else if (buttonType !== 'NONE') {
			return (
				<PaymentRequestButton>
					<PaymentRequestButtonElement
						options={{ paymentRequest }}
						onClick={handleButtonClick}
					/>
				</PaymentRequestButton>
			);
		}
	}
	return null;
}
