import { css } from '@emotion/react';
import {
	Radio,
	RadioGroup,
	SvgCreditCard,
	SvgDirectDebit,
	SvgPayPal,
} from '@guardian/source/react-components';
import type { RecentlySignedInExistingPaymentMethod } from 'helpers/forms/existingPaymentMethods/existingPaymentMethods';
import type { ReactNode } from 'react';
import React, { useEffect } from 'react';
import Rows from 'components/base/rows';
import SvgAmazonPayLogoDs from 'components/svgs/amazonPayLogoDs';
import SvgSepa from 'components/svgs/sepa';
import type { PaymentMethod } from 'helpers/forms/paymentMethods';
import type { Option } from 'helpers/types/option';

type PropTypes = {
	availablePaymentMethods: PaymentMethod[];
	paymentMethod: Option<PaymentMethod>;
	setPaymentMethod: (method: PaymentMethod) => void;
	validationError: string | undefined;
	fullExistingPaymentMethods?: RecentlySignedInExistingPaymentMethod[];
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

const paymentMethodData = {
	Stripe: {
		id: 'qa-credit-card',
		label: 'Credit/Debit card',
		icon: <SvgCreditCard />,
	},
	PayPal: {
		id: 'qa-paypal',
		label: 'PayPal',
		icon: <SvgPayPal />,
	},
	DirectDebit: {
		id: 'qa-direct-debit',
		label: 'Direct debit',
		icon: <SvgDirectDebit />,
	},
	Sepa: {
		id: 'qa-direct-debit-sepa',
		label: 'Direct debit (SEPA)',
		icon: <SvgSepa />,
	},
	AmazonPay: {
		id: 'qa-amazon-pay',
		label: 'Amazon Pay',
		icon: <SvgAmazonPayLogoDs />,
	},
	None: {
		id: 'qa-none',
		label: 'Other Payment Method',
		icon: <SvgCreditCard />,
	},
};

function PaymentMethodSelector({
	availablePaymentMethods,
	paymentMethod,
	setPaymentMethod,
	validationError,
}: PropTypes): JSX.Element {
	useEffect(() => {
		availablePaymentMethods.length === 1 &&
			setPaymentMethod(availablePaymentMethods[0]);
	}, []);

	return (
		<Rows gap="large">
			<RadioGroup
				id="payment-methods"
				label="How would you like to pay?"
				hideLabel
				error={validationError}
				role="radiogroup"
			>
				<>
					{availablePaymentMethods.map((method) => (
						<RadioWithImage
							id={paymentMethodData[method].id}
							image={paymentMethodData[method].icon}
							label={paymentMethodData[method].label}
							name="paymentMethod"
							checked={paymentMethod === method}
							onChange={() => setPaymentMethod(method)}
						/>
					))}
				</>
			</RadioGroup>
		</Rows>
	);
}

export { PaymentMethodSelector };
