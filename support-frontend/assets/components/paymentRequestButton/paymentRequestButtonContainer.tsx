import {
	PaymentRequestButtonElement,
	useStripe,
} from '@stripe/react-stripe-js';
import { ContributionsStripe } from 'components/stripe/contributionsStripe';
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

	if (paymentRequest) {
		if (paymentType === 'PAY_NOW') {
			return (
				<PaymentRequestButton
					button={<CustomButton onClick={() => paymentRequest.show()} />}
				/>
			);
		} else if (paymentType !== 'NONE') {
			return (
				<PaymentRequestButton
					button={<PaymentRequestButtonElement options={{ paymentRequest }} />}
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
