import {
	PaymentRequestButtonElement,
	useStripe,
} from '@stripe/react-stripe-js';
import { ContributionsStripe } from 'components/stripe/contributionsStripe';
import { Stripe } from 'helpers/forms/paymentMethods';
import { setPaymentMethod } from 'helpers/redux/checkout/payment/paymentMethod/actions';
import { useContributionsDispatch } from 'helpers/redux/storeHooks';
import { trackComponentClick } from 'helpers/tracking/behaviour';
import { usePaymentRequest } from './hooks/usePaymentRequest';
import { PaymentRequestButton } from './paymentRequestButton';

type CustomButtonProps = {
	onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

type PaymentRequestButtonContainerProps = {
	CustomButton: React.FC<CustomButtonProps>;
};

function AvailablePaymentRequestButton({
	CustomButton,
}: PaymentRequestButtonContainerProps) {
	const stripe = useStripe();
	const [paymentType, paymentRequest] = usePaymentRequest(stripe);
	const dispatch = useContributionsDispatch();

	function handleButtonClick() {
		// TODO: VALIDATE OTHER AMOUNT FIELD HERE
		trackComponentClick('apple-pay-clicked');
		dispatch(setPaymentMethod(Stripe));
	}

	if (paymentRequest) {
		if (paymentType === 'PAY_NOW') {
			return (
				<PaymentRequestButton
					button={
						<CustomButton
							onClick={() => {
								handleButtonClick();
								paymentRequest.show();
							}}
						/>
					}
				/>
			);
		} else if (paymentType !== 'NONE') {
			return (
				<PaymentRequestButton
					button={
						<PaymentRequestButtonElement
							options={{ paymentRequest }}
							onClick={handleButtonClick}
						/>
					}
				/>
			);
		}
	}
	return <PaymentRequestButton />;
}

export function PaymentRequestButtonContainer({
	CustomButton,
}: PaymentRequestButtonContainerProps): JSX.Element {
	return (
		<ContributionsStripe>
			<AvailablePaymentRequestButton CustomButton={CustomButton} />
		</ContributionsStripe>
	);
}
