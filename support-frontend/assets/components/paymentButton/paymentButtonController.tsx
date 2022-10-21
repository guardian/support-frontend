import type { PaymentMethod } from 'helpers/forms/paymentMethods';
import { useContributionsSelector } from 'helpers/redux/storeHooks';

type PaymentButtonControllerProps = {
	paymentButtons: Record<PaymentMethod, React.FC>;
};

export function PaymentButtonController({
	paymentButtons,
}: PaymentButtonControllerProps): JSX.Element {
	const paymentMethod = useContributionsSelector(
		(state) => state.page.checkoutForm.payment.paymentMethod,
	);
	const ButtonToRender = paymentButtons[paymentMethod];

	return <ButtonToRender />;
}
