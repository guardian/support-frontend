import { css } from '@emotion/react';
import {
	Radio,
	RadioGroup,
	SvgCreditCard,
	SvgDirectDebit,
	SvgPayPal,
} from '@guardian/source-react-components';
import { useEffect } from 'preact/hooks';
import type { ReactNode } from 'react';
import Rows from 'components/base/rows';
import AnimatedDots from 'components/spinners/animatedDots';
import SvgAmazonPayLogoDs from 'components/svgs/amazonPayLogoDs';
import SvgSepa from 'components/svgs/sepa';
import type {
	ExistingPaymentMethod,
	RecentlySignedInExistingPaymentMethod,
} from 'helpers/forms/existingPaymentMethods/existingPaymentMethods';
import {
	getExistingPaymentMethodLabel,
	mapExistingPaymentMethodToPaymentMethod,
	subscriptionsToExplainerList,
	subscriptionToExplainerPart,
} from 'helpers/forms/existingPaymentMethods/existingPaymentMethods';
import type { PaymentMethod } from 'helpers/forms/paymentMethods';
import type { Option } from 'helpers/types/option';
import { getReauthenticateUrl } from 'helpers/urls/externalLinks';

type PropTypes = {
	availablePaymentMethods: PaymentMethod[];
	paymentMethod: Option<PaymentMethod>;
	setPaymentMethod: (method: PaymentMethod) => void;
	validationError: string | undefined;
	fullExistingPaymentMethods?: RecentlySignedInExistingPaymentMethod[];
	contributionTypeIsRecurring?: boolean;
	existingPaymentMethod?: RecentlySignedInExistingPaymentMethod;
	existingPaymentMethods?: ExistingPaymentMethod[];
	updateExistingPaymentMethod?: (
		existingPaymentMethod: RecentlySignedInExistingPaymentMethod,
	) => void;
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

interface PaymentMethodLabelProps {
	label: string;
	logo: JSX.Element;
	isChecked: boolean;
}

const labelContainer = css`
	display: flex;
	width: 100%;
	margin: 0;
	justify-content: space-between;
	align-items: center;

	svg {
		width: 36px;
		height: 24px;
		display: block;
	}

	&[data-checked='false'] {
		svg {
			filter: grayscale(100%);
		}
	}
`;

const explainerListContainer = css`
	font-size: small;
	font-style: italic;
	margin-left: 40px;
	padding-bottom: 6px;
	color: #767676;
	padding-right: 40px;
`;

function PaymentMethodLabel({
	label,
	logo,
	isChecked,
}: PaymentMethodLabelProps) {
	return (
		<div css={labelContainer} data-checked={isChecked.toString()}>
			<div>{label}</div>
			{logo}
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
	ExistingCard: {
		id: 'qa-existing-card',
		label: 'Other Payment Method',
		icon: <SvgCreditCard />,
	},
	ExistingDirectDebit: {
		id: 'qa-existing-direct-debit',
		label: 'Other Payment Method',
		icon: <SvgDirectDebit />,
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
	fullExistingPaymentMethods,
	contributionTypeIsRecurring,
	existingPaymentMethod,
	existingPaymentMethods,
	updateExistingPaymentMethod,
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
					{contributionTypeIsRecurring && !existingPaymentMethods && (
						<div className="awaiting-existing-payment-options">
							<AnimatedDots appearance="medium" />
						</div>
					)}

					{contributionTypeIsRecurring &&
						fullExistingPaymentMethods?.map(
							(
								preExistingPaymentMethod: RecentlySignedInExistingPaymentMethod,
							) => (
								<>
									<Radio
										id={`paymentMethod-existing${preExistingPaymentMethod.billingAccountId}`}
										name="paymentMethod"
										type="radio"
										value={preExistingPaymentMethod.paymentType}
										onChange={() =>
											updateExistingPaymentMethod?.(preExistingPaymentMethod)
										}
										checked={
											paymentMethod ===
												mapExistingPaymentMethodToPaymentMethod(
													preExistingPaymentMethod,
												) && existingPaymentMethod === preExistingPaymentMethod
										}
										arial-labelledby="payment_method"
										label={
											<PaymentMethodLabel
												label={getExistingPaymentMethodLabel(
													preExistingPaymentMethod,
												)}
												logo={
													paymentMethodData[
														mapExistingPaymentMethodToPaymentMethod(
															preExistingPaymentMethod,
														)
													].icon
												}
												isChecked={
													existingPaymentMethod === preExistingPaymentMethod
												}
											/>
										}
									/>

									<div css={explainerListContainer}>
										Used for your{' '}
										{subscriptionsToExplainerList(
											preExistingPaymentMethod.subscriptions.map(
												subscriptionToExplainerPart,
											),
										)}
									</div>
								</>
							),
						)}

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

					{contributionTypeIsRecurring &&
						existingPaymentMethods &&
						existingPaymentMethods.length > 0 &&
						fullExistingPaymentMethods?.length === 0 && (
							<li className="form__radio-group-item">
								...or{' '}
								<a
									className="reauthenticate-link"
									href={getReauthenticateUrl()}
								>
									re-enter your password
								</a>{' '}
								to use one of your existing payment methods.
							</li>
						)}
				</>
			</RadioGroup>
		</Rows>
	);
}

export { PaymentMethodSelector };
