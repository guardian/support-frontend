import { css } from '@emotion/react';
import type { SerializedStyles } from '@emotion/utils';
import { from, headline, space } from '@guardian/source-foundations';
import { Accordion, RadioGroup } from '@guardian/source-react-components';
import { useEffect } from 'react';
import GeneralErrorMessage from 'components/generalErrorMessage/generalErrorMessage';
import { SecureTransactionIndicator } from 'components/secureTransactionIndicator/secureTransactionIndicator';
import AnimatedDots from 'components/spinners/animatedDots';
import type {
	ExistingPaymentMethod,
	RecentlySignedInExistingPaymentMethod,
} from 'helpers/forms/existingPaymentMethods/existingPaymentMethods';
import { mapExistingPaymentMethodToPaymentMethod } from 'helpers/forms/existingPaymentMethods/existingPaymentMethods';
import type { PaymentMethod } from 'helpers/forms/paymentMethods';
import { setPaymentMethod } from 'helpers/redux/checkout/payment/paymentMethod/actions';
import { useContributionsDispatch } from 'helpers/redux/storeHooks';
import { getReauthenticateUrl } from 'helpers/urls/externalLinks';
import ContributionChoicesHeader from 'pages/contributions-landing/components/ContributionChoicesHeader';
import { paymentMethodData } from './paymentMethodData';
import {
	AvailablePaymentMethodAccordionRow,
	ExistingPaymentMethodAccordionRow,
} from './paymentMethodSelectorAccordionRow';

const container = css`
	margin-top: ${space[6]}px;
`;

const header = css`
	${headline.small({ fontWeight: 'bold' })};

	${from.desktop} {
		font-size: 28px;
	}
`;

function PaymentMethodSelectorLegend() {
	return (
		<div
			css={css`
				display: flex;
				justify-content: space-between;
			`}
		>
			<legend id="payment_method">
				<ContributionChoicesHeader cssOverrides={header}>
					Payment Method
				</ContributionChoicesHeader>
			</legend>
			<SecureTransactionIndicator position="middle" hideText={true} />
		</div>
	);
}

export interface PaymentMethodSelectorProps {
	cssOverrides?: SerializedStyles;
	availablePaymentMethods: PaymentMethod[];
	paymentMethod: PaymentMethod | null;
	validationError: string | undefined;
	fullExistingPaymentMethods?: RecentlySignedInExistingPaymentMethod[];
	contributionTypeIsRecurring?: boolean;
	existingPaymentMethod?: RecentlySignedInExistingPaymentMethod;
	existingPaymentMethods?: ExistingPaymentMethod[];
}

export function PaymentMethodSelector({
	availablePaymentMethods,
	paymentMethod,
	validationError,
	fullExistingPaymentMethods,
	contributionTypeIsRecurring,
	existingPaymentMethod,
	existingPaymentMethods,
}: PaymentMethodSelectorProps): JSX.Element {
	const dispatch = useContributionsDispatch();

	useEffect(() => {
		availablePaymentMethods.length === 1 &&
			dispatch(setPaymentMethod(availablePaymentMethods[0]));
	}, []);

	const fullExistingRecurringPaymentMethods =
		contributionTypeIsRecurring && fullExistingPaymentMethods;

	if (
		fullExistingPaymentMethods &&
		fullExistingPaymentMethods.length < 1 &&
		availablePaymentMethods.length < 1
	) {
		return (
			<GeneralErrorMessage
				classModifiers={['no-valid-payments']}
				errorHeading="Payment methods are unavailable"
				errorReason="all_payment_methods_unavailable"
			/>
		);
	}

	return (
		<div css={container}>
			<PaymentMethodSelectorLegend />
			<RadioGroup
				label="Select payment method"
				hideLabel
				error={validationError}
			>
				{contributionTypeIsRecurring && !existingPaymentMethods && (
					<div className="awaiting-existing-payment-options">
						<AnimatedDots appearance="medium" />
					</div>
				)}

				<Accordion
					cssOverrides={css`
						border-bottom: none;
					`}
				>
					{[
						<>
							{fullExistingRecurringPaymentMethods &&
								fullExistingPaymentMethods.map(
									(
										preExistingPaymentMethod: RecentlySignedInExistingPaymentMethod,
									) => (
										<ExistingPaymentMethodAccordionRow
											expanded={
												paymentMethod ===
													mapExistingPaymentMethodToPaymentMethod(
														preExistingPaymentMethod,
													) &&
												existingPaymentMethod === preExistingPaymentMethod
											}
											paymentMethod={paymentMethod}
											preExistingPaymentMethod={preExistingPaymentMethod}
											existingPaymentMethod={existingPaymentMethod}
										/>
									),
								)}

							{availablePaymentMethods.map((method) => (
								<AvailablePaymentMethodAccordionRow
									id={paymentMethodData[method].id}
									image={paymentMethodData[method].icon}
									label={paymentMethodData[method].label}
									name="paymentMethod"
									checked={paymentMethod === method}
									onChange={() => dispatch(setPaymentMethod(method))}
									accordionBody={paymentMethodData[method].accordionBody}
								/>
							))}
						</>,
					]}
				</Accordion>

				{contributionTypeIsRecurring &&
					existingPaymentMethods &&
					existingPaymentMethods.length > 0 &&
					fullExistingPaymentMethods?.length === 0 && (
						<li className="form__radio-group-item">
							...or{' '}
							<a className="reauthenticate-link" href={getReauthenticateUrl()}>
								re-enter your password
							</a>{' '}
							to use one of your existing payment methods.
						</li>
					)}
			</RadioGroup>
		</div>
	);
}
