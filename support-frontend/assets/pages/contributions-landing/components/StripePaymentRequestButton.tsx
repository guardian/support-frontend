import { css } from '@emotion/core';
import { Button } from '@guardian/src-button';
import { neutral, space } from '@guardian/src-foundations';
import { PaymentRequestButtonElement } from '@stripe/react-stripe-js';
import React from 'react';
import GeneralErrorMessage from 'components/generalErrorMessage/generalErrorMessage';
import type { RenderPrbInput } from 'components/StripePaymentRequestButton/StripePaymentRequestButton';
import StripePaymentRequestButtonContainer from 'components/StripePaymentRequestButton/StripePaymentRequestButtonContainer';
import type {
	ContributionType,
	OtherAmounts,
	SelectedAmounts,
} from 'helpers/contributions';
import type { IsoCountry } from 'helpers/internationalisation/country';
import { fromCountry } from 'helpers/internationalisation/countryGroup';
import type { IsoCurrency } from 'helpers/internationalisation/currency';

interface StripePaymentRequestButtonProps {
	country: IsoCountry;
	currency: IsoCurrency;
	isTestUser: boolean;
	contributionType: ContributionType;
	selectedAmounts: SelectedAmounts;
	otherAmounts: OtherAmounts;
}

function StripePaymentRequestButton({
	country,
	currency,
	isTestUser,
	contributionType,
	selectedAmounts,
	otherAmounts,
}: StripePaymentRequestButtonProps): JSX.Element {
	return (
		<StripePaymentRequestButtonContainer
			country={country}
			currency={currency}
			isTestUser={isTestUser}
			contributionType={contributionType}
			selectedAmounts={selectedAmounts}
			otherAmounts={otherAmounts}
			renderPrb={({
				type,
				paymentRequest,
				paymentRequestError,
				onStripePrbClick,
				onCustomPrbClick,
			}) => (
				<Prb
					country={country}
					contributionType={contributionType}
					type={type}
					paymentRequest={paymentRequest}
					paymentRequestError={paymentRequestError}
					onStripePrbClick={onStripePrbClick}
					onCustomPrbClick={onCustomPrbClick}
				/>
			)}
		/>
	);
}

// ---- Helper component ---- //

interface PrbProps extends RenderPrbInput {
	country: IsoCountry;
	contributionType: ContributionType;
}

function Prb({
	country,
	contributionType,
	type,
	paymentRequest,
	paymentRequestError,
	onStripePrbClick,
	onCustomPrbClick,
}: PrbProps) {
	const countryGroupId = fromCountry(country);

	const isUkOrEuRecurring =
		contributionType !== 'ONE_OFF' &&
		(countryGroupId === 'GBPCountries' || countryGroupId === 'EURCountries');

	const shouldShowPrb =
		type === 'APPLE_PAY' || type === 'GOOGLE_PAY' || !isUkOrEuRecurring;

	if (!shouldShowPrb) {
		return null;
	}

	const shouldShowStripePrb = type === 'APPLE_PAY' || type === 'GOOGLE_PAY';

	return (
		<>
			{shouldShowStripePrb ? (
				<PaymentRequestButtonElement
					options={{
						paymentRequest,
						style: styles.stripePrb,
					}}
					onClick={onStripePrbClick}
				/>
			) : (
				<div>
					<Button onClick={onCustomPrbClick} css={styles.customPrb}>
						Pay with saved card
					</Button>
				</div>
			)}

			{paymentRequestError && (
				<GeneralErrorMessage errorReason={paymentRequestError} />
			)}

			<div css={styles.dividerContainer}>or</div>
		</>
	);
}

//  ---- Styles ---- //

const styles = {
	stripePrb: {
		paymentRequestButton: {
			theme: 'dark',
			height: '42px',
		},
	} as const,
	customPrb: css`
		width: 100%;
		justify-content: center;
		margin: ${space[6]}px 0;
		background: #323457;

		&:hover {
			background: #1c1d31;
		}
	`,
	dividerContainer: css`
		line-height: 32px;
		padding: 0;
		position: relative;
		overflow: hidden;
		text-align: center;

		&:before,
		&:after {
			content: ' ';
			position: absolute;
			top: 50%;
			margin-left: -999em;
			height: 2px;
			width: 998em;
			border-top: solid 1px ${neutral[86]};
		}

		&:after {
			left: auto;
			width: 999em;
			margin: 0 0 0 1em;
		}
	`,
};

export default StripePaymentRequestButton;
