import { css } from '@emotion/react';
import { brand, neutral, space, textSans } from '@guardian/source-foundations';
import { Radio } from '@guardian/source-react-components';
import type { PaymentMethod } from 'helpers/forms/paymentMethods';

const defaultRadioStyles = css`
	display: flex;
	align-items: center;
	padding: ${space[4]}px;
	margin-bottom: ${space[4]}px;
	${textSans.medium({ lineHeight: 'regular' })};
	font-weight: bold;
	color: ${neutral[46]};
	border-radius: 4px;
	box-shadow: inset 0px 0px 0px 2px ${neutral[46]};
	cursor: pointer;
	&:hover {
		box-shadow: inset 0px 0px 0px 4px ${brand[500]};
	}
`;

const checkedRadioStyles = css`
	box-shadow: inset 0px 0px 0px 4px ${brand[500]};
	background-color: #e3f6ff;
	color: ${brand[400]};
`;

export function PaymentMethodRadioButton({
	paymentMethod,
	value,
	updatePaymentMethod,
}: {
	paymentMethod: PaymentMethod;
	value: PaymentMethod;
	updatePaymentMethod: (newPaymentMethod: PaymentMethod) => void;
}): JSX.Element {
	const isChecked = value === paymentMethod;

	return (
		<label
			data-cy={paymentMethod}
			css={css`
				${defaultRadioStyles}
				${isChecked && checkedRadioStyles}
			`}
		>
			<Radio
				checked={isChecked}
				onChange={(changeEvent: React.ChangeEvent<HTMLInputElement>) =>
					updatePaymentMethod(changeEvent.target.value as PaymentMethod)
				}
				value={paymentMethod}
			/>
			{paymentMethod}
		</label>
	);
}
