import { css } from '@emotion/react';
import type { SerializedStyles } from '@emotion/utils';
import { headline, space } from '@guardian/source-foundations';
import { Accordion, RadioGroup } from '@guardian/source-react-components';
import GeneralErrorMessage from 'components/generalErrorMessage/generalErrorMessage';
import { SecureTransactionIndicator } from 'components/secureTransactionIndicator/secureTransactionIndicator';
import AnimatedDots from 'components/spinners/animatedDots';
import type { RecentlySignedInExistingPaymentMethod } from 'helpers/forms/existingPaymentMethods/existingPaymentMethods';
import {
	getExistingPaymentMethodLabel,
	subscriptionsToExplainerList,
	subscriptionToExplainerPart,
} from 'helpers/forms/existingPaymentMethods/existingPaymentMethods';
import type { PaymentMethod } from 'helpers/forms/paymentMethods';
import type { CSSOverridable } from 'helpers/types/cssOverrideable';
import { paymentMethodData } from './paymentMethodData';
import { AvailablePaymentMethodAccordionRow } from './paymentMethodSelectorAccordionRow';
import { ReauthenticateLink } from './reauthenticateLink';

const container = css`
	margin-top: ${space[6]}px;
`;

const header = css`
	margin-bottom: ${space[3]}px;
	${headline.small({ fontWeight: 'bold' })};
`;

const securetransactionindicator = css`
	margin-bottom: ${space[3]}px;
	${headline.small({ fontWeight: 'bold' })};
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
				<h2 css={header}>Payment method</h2>
			</legend>
			<SecureTransactionIndicator
				hideText={true}
				cssOverrides={securetransactionindicator}
			/>
		</div>
	);
}

export interface PaymentMethodSelectorProps extends CSSOverridable {
	cssOverrides?: SerializedStyles;
	availablePaymentMethods: PaymentMethod[];
	paymentMethod: PaymentMethod | null;
	validationError: string | undefined;
	existingPaymentMethod?: RecentlySignedInExistingPaymentMethod;
	existingPaymentMethodList: RecentlySignedInExistingPaymentMethod[];
	pendingExistingPaymentMethods?: boolean;
	showReauthenticateLink?: boolean;
	onPaymentMethodEvent: (
		event: 'select' | 'render',
		paymentMethod: PaymentMethod,
		existingPaymentMethod?: RecentlySignedInExistingPaymentMethod,
	) => void;
}

export function PaymentMethodSelector({
	availablePaymentMethods,
	paymentMethod,
	validationError,
	existingPaymentMethod,
	existingPaymentMethodList,
	pendingExistingPaymentMethods,
	showReauthenticateLink,
	onPaymentMethodEvent,
	cssOverrides,
}: PaymentMethodSelectorProps): JSX.Element {
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
		<div css={[container, cssOverrides]}>
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
							{existingPaymentMethodList
								.filter(
									(
										preExistingPaymentMethod: RecentlySignedInExistingPaymentMethod,
									) => !!preExistingPaymentMethod.billingAccountId,
								)
								.map(
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
											<AvailablePaymentMethodAccordionRow
												id={`paymentMethod-existing${preExistingPaymentMethod.billingAccountId}`}
												name="paymentMethod"
												label={getExistingPaymentMethodLabel(
													preExistingPaymentMethod,
												)}
												image={paymentMethodData[paymentType].icon}
												checked={
													paymentMethod === paymentType &&
													existingPaymentMethod === preExistingPaymentMethod
												}
												supportingText={`Used for your ${subscriptionsToExplainerList(
													preExistingPaymentMethod.subscriptions.map(
														subscriptionToExplainerPart,
													),
												)}`}
												onChange={() => {
													onPaymentMethodEvent(
														'select',
														paymentType,
														preExistingPaymentMethod,
													);
												}}
												accordionBody={
													paymentMethodData[paymentType].accordionBody
												}
												onRender={() => {
													onPaymentMethodEvent(
														'render',
														paymentType,
														preExistingPaymentMethod,
													);
												}}
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
									onChange={() => onPaymentMethodEvent('select', method)}
									accordionBody={paymentMethodData[method].accordionBody}
									onRender={() => onPaymentMethodEvent('render', method)}
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
