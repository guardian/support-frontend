import type { PaymentMethod } from 'helpers/forms/paymentMethods';
import { useContributionsSelector } from 'helpers/redux/storeHooks';
import { DefaultPaymentButtonContainer } from './defaultPaymentButtonContainer';

type PaymentButtonControllerProps = {
	paymentButtons: Partial<Record<PaymentMethod, React.FC>>;
};

function NoPaymentMethodButton(): JSX.Element {
	return (
		<DefaultPaymentButtonContainer
			// TODO: Some kind of 'please select a payment method' validation
			onClick={() => console.log('not implemented')}
		/>
	);
}

export function PaymentButtonController({
	paymentButtons,
}: PaymentButtonControllerProps): JSX.Element {
	const paymentMethod = useContributionsSelector(
		(state) => state.page.checkoutForm.payment.paymentMethod,
	);
	const ButtonToRender = paymentButtons[paymentMethod] ?? NoPaymentMethodButton;

	return <ButtonToRender />;
}
