import {
	PaymentRequestButtonElement,
	useStripe,
} from '@stripe/react-stripe-js';
import { useEffect } from 'preact/hooks';
import { useState } from 'react';
import { ContributionsStripe } from 'components/stripe/contributionsStripe';
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

type AvailablePaymentRequestButtonProps = PaymentRequestButtonContainerProps & {
	setShouldShowButton: (shouldShowButton: boolean) => void;
};

function AvailablePaymentRequestButton({
	CustomButton,
	setShouldShowButton,
}: AvailablePaymentRequestButtonProps) {
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

	useEffect(() => {
		if (buttonType !== 'NONE') {
			setShouldShowButton(true);
		}
	}, [buttonType]);

	if (paymentRequest) {
		if (buttonType === 'PAY_NOW') {
			return (
				<CustomButton
					onClick={() => {
						handleButtonClick();
						paymentRequest.show();
					}}
				/>
			);
		} else if (buttonType !== 'NONE') {
			return (
				<PaymentRequestButtonElement
					options={{ paymentRequest }}
					onClick={handleButtonClick}
				/>
			);
		}
	}
	return null;
}

export function PaymentRequestButtonContainer({
	CustomButton,
}: PaymentRequestButtonContainerProps): JSX.Element {
	const [shouldShowButton, setShouldShowButton] = useState<boolean>(false);

	return (
		<PaymentRequestButton shouldShowButton={shouldShowButton}>
			<ContributionsStripe>
				<AvailablePaymentRequestButton
					setShouldShowButton={setShouldShowButton}
					CustomButton={CustomButton}
				/>
			</ContributionsStripe>
		</PaymentRequestButton>
	);
}
