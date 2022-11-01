import { css } from '@emotion/react';
import { space } from '@guardian/source-foundations';
import type { PaymentMethod } from 'helpers/forms/paymentMethods';
import { useContributionsSelector } from 'helpers/redux/storeHooks';
import { NoPaymentMethodButton } from './noPaymentMethodButton';

const paymentButtonSpacing = css`
	margin-top: ${space[9]}px;
	margin-bottom: ${space[6]}px;
`;

type PaymentButtonControllerProps = {
	paymentButtons: Partial<Record<PaymentMethod, React.FC>>;
};

export function PaymentButtonController({
	paymentButtons,
}: PaymentButtonControllerProps): JSX.Element {
	const paymentMethod = useContributionsSelector(
		(state) => state.page.checkoutForm.payment.paymentMethod.name,
	);
	const ButtonToRender = paymentButtons[paymentMethod] ?? NoPaymentMethodButton;

	return (
		<div css={paymentButtonSpacing}>
			<ButtonToRender />
		</div>
	);
}
