import { css } from '@emotion/react';
import { space } from '@guardian/source-foundations';
import type { PaymentMethod } from 'helpers/forms/paymentMethods';
import { useContributionsSelector } from 'helpers/redux/storeHooks';
import { DefaultPaymentButtonContainer } from './defaultPaymentButtonContainer';
import { NoPaymentMethodButton } from './noPaymentMethodButton';

const paymentButtonSpacing = css`
	margin-top: ${space[9]}px;
	margin-bottom: ${space[6]}px;
`;

export type PaymentButtonComponentProps = {
	DefaultButtonContainer: typeof DefaultPaymentButtonContainer;
};

type PaymentButtonControllerProps = {
	paymentButtons: Partial<
		Record<PaymentMethod, React.FC<PaymentButtonComponentProps>>
	>;
	defaultContainer?: typeof DefaultPaymentButtonContainer;
};

export function PaymentButtonController({
	paymentButtons,
	defaultContainer = DefaultPaymentButtonContainer,
}: PaymentButtonControllerProps): JSX.Element {
	const paymentMethod = useContributionsSelector(
		(state) => state.page.checkoutForm.payment.paymentMethod.name,
	);
	const ButtonToRender = paymentButtons[paymentMethod] ?? NoPaymentMethodButton;

	return (
		<div css={paymentButtonSpacing}>
			<ButtonToRender DefaultButtonContainer={defaultContainer} />
		</div>
	);
}
