import { css } from '@emotion/react';
import { space } from '@guardian/source/foundations';
import type { PaymentMethod } from 'helpers/forms/paymentMethods';
import { useContributionsSelector } from 'helpers/redux/storeHooks';
import type { CSSOverridable } from 'helpers/types/cssOverrideable';
import { DefaultPaymentButtonContainer } from './defaultPaymentButtonContainer';
import { NoPaymentMethodButton } from './noPaymentMethodButton';

const paymentButtonSpacing = css`
	margin-top: ${space[9]}px;
	margin-bottom: ${space[6]}px;
`;

export type PaymentButtonComponentProps = {
	DefaultButtonContainer: typeof DefaultPaymentButtonContainer;
};

interface PaymentButtonControllerProps extends CSSOverridable {
	paymentButtons: Partial<
		Record<PaymentMethod, React.FC<PaymentButtonComponentProps>>
	>;
	defaultContainer?: typeof DefaultPaymentButtonContainer;
}

export function PaymentButtonController({
	paymentButtons,
	defaultContainer = DefaultPaymentButtonContainer,
	cssOverrides,
}: PaymentButtonControllerProps): JSX.Element {
	const paymentMethod = useContributionsSelector(
		(state) => state.page.checkoutForm.payment.paymentMethod.name,
	);
	const ButtonToRender = paymentButtons[paymentMethod] ?? NoPaymentMethodButton;

	return (
		<div css={[paymentButtonSpacing, cssOverrides]}>
			<ButtonToRender DefaultButtonContainer={defaultContainer} />
		</div>
	);
}
