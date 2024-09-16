import { css } from '@emotion/react';
import type { SerializedStyles } from '@emotion/utils';
import { from, headlineBold24, space } from '@guardian/source/foundations';
import { Accordion, RadioGroup } from '@guardian/source/react-components';
import GeneralErrorMessage from 'components/generalErrorMessage/generalErrorMessage';
import { SecureTransactionIndicator } from 'components/secureTransactionIndicator/secureTransactionIndicator';
import type { PaymentMethod } from 'helpers/forms/paymentMethods';
import { paymentMethodData } from './paymentMethodData';
import { AvailablePaymentMethodAccordionRow } from './paymentMethodSelectorAccordionRow';
import { ReauthenticateLink } from './reauthenticateLink';

const container = css`
	margin-top: ${space[6]}px;
`;

const header = css`
	margin-bottom: ${space[3]}px;
	${headlineBold24};
	${from.tablet} {
		font-size: 28px;
	}
`;

const paymentLegendOverrides = css`
	margin-bottom: ${space[3]}px;
`;

type PaymentMethodSelectorLegendProps = {
	cssOverrides?: SerializedStyles;
	overrideHeadingCopy?: string;
};

function PaymentMethodSelectorLegend({
	cssOverrides,
	overrideHeadingCopy,
}: PaymentMethodSelectorLegendProps) {
	return (
		<div
			css={css`
				display: flex;
				justify-content: space-between;
			`}
		>
			<legend id="payment_method">
				<h2 css={header}>{overrideHeadingCopy ?? 'Payment method'}</h2>
			</legend>
			<SecureTransactionIndicator
				hideText={true}
				cssOverrides={cssOverrides ?? css``}
			/>
		</div>
	);
}

export type PaymentMethodSelectorProps = {
	availablePaymentMethods: PaymentMethod[];
	paymentMethod: PaymentMethod | null;
	validationError: string | undefined;
	showReauthenticateLink?: boolean;
	onPaymentMethodEvent: (
		event: 'select' | 'render',
		paymentMethod: PaymentMethod,
	) => void;
	overrideHeadingCopy?: string;
};

export function PaymentMethodSelector({
	availablePaymentMethods,
	paymentMethod,
	validationError,
	showReauthenticateLink,
	onPaymentMethodEvent,
	overrideHeadingCopy,
}: PaymentMethodSelectorProps): JSX.Element {
	if (availablePaymentMethods.length < 1) {
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
			<PaymentMethodSelectorLegend
				cssOverrides={paymentLegendOverrides}
				overrideHeadingCopy={overrideHeadingCopy}
			/>
			<RadioGroup
				id="paymentMethod"
				role="radiogroup"
				label="Select payment method"
				hideLabel
				error={validationError}
			>
				<Accordion
					cssOverrides={css`
						border-bottom: none;
					`}
				>
					{[
						<>
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
