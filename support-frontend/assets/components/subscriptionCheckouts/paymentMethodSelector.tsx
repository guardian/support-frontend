import { css } from '@emotion/react';
import {
	Radio,
	RadioGroup,
	SvgCreditCard,
	SvgDirectDebit,
	SvgPayPal,
} from '@guardian/source-react-components';
import type { ReactNode } from 'react';
import Rows from 'components/base/rows';
import type { PaymentMethod } from 'helpers/forms/paymentMethods';
import type { Option } from 'helpers/types/option';

type PropTypes = {
	availablePaymentMethods: PaymentMethod[];
	paymentMethod: Option<PaymentMethod>;
	setPaymentMethod: (method: PaymentMethod) => void;
	validationError: string | undefined;
};

type RadioWithImagePropTypes = {
	id: string;
	image: ReactNode;
	label: string;
	name: string;
	checked: boolean;
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const radioWithImageStyles = css`
	display: inline-flex;
	justify-content: space-between;
	align-items: center;
`;

const paymentIcon = css`
	min-width: 30px;
	max-width: 40px;
`;

function RadioWithImage({
	id,
	image,
	label,
	checked,
	name,
	onChange,
}: RadioWithImagePropTypes) {
	return (
		<div css={radioWithImageStyles}>
			<Radio
				id={id}
				label={label}
				checked={checked}
				name={name}
				onChange={onChange}
			/>
			<div css={paymentIcon}>{image}</div>
		</div>
	);
}

const paymentMethodIcons: Record<PaymentMethod, ReactNode> = {
	Stripe: <SvgCreditCard />,
	PayPal: <SvgPayPal />,
	DirectDebit: <SvgDirectDebit />,
	Sepa: '',
	ExistingCard: '',
	ExistingDirectDebit: '',
	AmazonPay: '',
	None: '',
};

const paymentMethodIds: Record<PaymentMethod, string> = {
	Stripe: 'qa-credit-card',
	PayPal: 'qa-paypal',
	DirectDebit: 'qa-direct-debit',
	Sepa: '',
	ExistingCard: '',
	ExistingDirectDebit: '',
	AmazonPay: '',
	None: '',
};

const paymentMethodText: Record<PaymentMethod, string> = {
	Stripe: 'Credit/Debit card',
	PayPal: 'PayPal',
	DirectDebit: 'Direct debit',
	Sepa: '',
	ExistingCard: '',
	ExistingDirectDebit: '',
	AmazonPay: '',
	None: '',
};

function PaymentMethodSelector({
	availablePaymentMethods,
	paymentMethod,
	setPaymentMethod,
	validationError,
}: PropTypes): JSX.Element {
	return (
		<Rows gap="large">
			<RadioGroup
				id="payment-methods"
				label="How would you like to pay?"
				hideLabel
				error={validationError}
				role="radiogroup"
			>
				{availablePaymentMethods.map((method) => (
					<RadioWithImage
						id={paymentMethodIds[method]}
						image={paymentMethodIcons[method]}
						label={paymentMethodText[method]}
						name="paymentMethod"
						checked={paymentMethod === method}
						onChange={() => setPaymentMethod(method)}
					/>
				))}
			</RadioGroup>
		</Rows>
	);
}

export { PaymentMethodSelector };
