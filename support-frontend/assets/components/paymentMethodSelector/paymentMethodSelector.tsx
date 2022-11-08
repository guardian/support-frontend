import { css } from '@emotion/react';
import type { SerializedStyles } from '@emotion/utils';
import { from, headline, space } from '@guardian/source-foundations';
import { Accordion, RadioGroup } from '@guardian/source-react-components';
import { useEffect } from 'react';
import GeneralErrorMessage from 'components/generalErrorMessage/generalErrorMessage';
import { SecureTransactionIndicator } from 'components/secureTransactionIndicator/secureTransactionIndicator';
import AnimatedDots from 'components/spinners/animatedDots';
import type { RecentlySignedInExistingPaymentMethod } from 'helpers/forms/existingPaymentMethods/existingPaymentMethods';
import { mapExistingPaymentMethodToPaymentMethod } from 'helpers/forms/existingPaymentMethods/existingPaymentMethods';
import type { PaymentMethod } from 'helpers/forms/paymentMethods';
import { setPaymentMethod } from 'helpers/redux/checkout/payment/paymentMethod/actions';
import { useContributionsDispatch } from 'helpers/redux/storeHooks';
import ContributionChoicesHeader from 'pages/contributions-landing/components/ContributionChoicesHeader';
import { updateSelectedExistingPaymentMethod } from 'pages/contributions-landing/contributionsLandingActions';
import { paymentMethodData } from './paymentMethodData';
import {
	AvailablePaymentMethodAccordionRow,
	ExistingPaymentMethodAccordionRow,
} from './paymentMethodSelectorAccordionRow';
import { ReauthenticateLink } from './reauthenticateLink';

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
					Payment method
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
	existingPaymentMethod?: RecentlySignedInExistingPaymentMethod;
	existingPaymentMethodList: RecentlySignedInExistingPaymentMethod[];
	pendingExistingPaymentMethods?: boolean;
	showReauthenticateLink?: boolean;
}

export function PaymentMethodSelector({
	availablePaymentMethods,
	paymentMethod,
	validationError,
	existingPaymentMethod,
	existingPaymentMethodList,
	pendingExistingPaymentMethods,
	showReauthenticateLink,
}: PaymentMethodSelectorProps): JSX.Element {
	const dispatch = useContributionsDispatch();

	useEffect(() => {
		availablePaymentMethods.length === 1 &&
			dispatch(setPaymentMethod(availablePaymentMethods[0]));
	}, []);

	if (
		existingPaymentMethodList.length < 1 &&
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
				id="paymentMethod"
				role="radiogroup"
				label="Select payment method"
				hideLabel
				error={validationError}
			>
				{pendingExistingPaymentMethods && (
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
							{existingPaymentMethodList.map(
								(
									preExistingPaymentMethod: RecentlySignedInExistingPaymentMethod,
								) => {
									const existingPaymentMethodType =
										preExistingPaymentMethod.paymentType;

									const paymentType: PaymentMethod =
										existingPaymentMethodType === 'Card'
											? 'ExistingCard'
											: 'ExistingDirectDebit';

									return (
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
											checked={
												paymentMethod ===
													mapExistingPaymentMethodToPaymentMethod(
														preExistingPaymentMethod,
													) &&
												existingPaymentMethod === preExistingPaymentMethod
											}
											onChange={() => {
												dispatch(setPaymentMethod(paymentType));
												dispatch(
													updateSelectedExistingPaymentMethod(
														preExistingPaymentMethod,
													),
												);
											}}
											accordionBody={
												paymentMethodData[paymentType].accordionBody
											}
										/>
									);
								},
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

				{showReauthenticateLink && <ReauthenticateLink />}
			</RadioGroup>
		</div>
	);
}
