import {
	PaymentRequestButtonElement,
	useStripe,
} from '@stripe/react-stripe-js';
import type { StripePaymentRequestButtonElementClickEvent } from '@stripe/stripe-js';
import { useFormValidation } from 'helpers/customHooks/useFormValidation';
import { Stripe } from 'helpers/forms/paymentMethods';
import { setPaymentMethod } from 'helpers/redux/checkout/payment/paymentMethod/actions';
import { clickPaymentRequestButton } from 'helpers/redux/checkout/payment/paymentRequestButton/actions';
import {
	useContributionsDispatch,
	useContributionsSelector,
} from 'helpers/redux/storeHooks';
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

	const { stripeAccount } = useContributionsSelector(
		(state) => state.page.checkoutForm.payment.stripeAccountDetails,
	);

	const handleButtonClick =
		useFormValidation<StripePaymentRequestButtonElementClickEvent>(
			function handleButtonClick() {
				paymentRequest?.show();
				trackComponentClick('apple-pay-clicked');
				dispatch(setPaymentMethod(Stripe));
			},
			false,
		);

	function onClick(event: StripePaymentRequestButtonElementClickEvent) {
		dispatch(clickPaymentRequestButton(stripeAccount));
		handleButtonClick(event);
	}

	if (paymentRequest) {
		if (buttonType === 'PAY_NOW') {
			return (
				<PaymentRequestButton>
					<CustomButton onClick={onClick} />
				</PaymentRequestButton>
			);
		} else if (buttonType !== 'NONE') {
			return (
				<PaymentRequestButton>
					<PaymentRequestButtonElement
						options={{ paymentRequest }}
						onClick={onClick}
					/>
				</PaymentRequestButton>
			);
		}
	}
	return null;
}
