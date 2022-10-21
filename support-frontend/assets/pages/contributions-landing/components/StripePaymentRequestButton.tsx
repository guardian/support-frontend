import { css } from '@emotion/react';
import { from, neutral, space } from '@guardian/source-foundations';
import { Button } from '@guardian/source-react-components';
import { PaymentRequestButtonElement } from '@stripe/react-stripe-js';
import GeneralErrorMessage from 'components/generalErrorMessage/generalErrorMessage';
import type { RenderPaymentRequestButtonInput } from 'components/StripePaymentRequestButton/StripePaymentRequestButton';
import StripePaymentRequestButtonContainer from 'components/StripePaymentRequestButton/StripePaymentRequestButtonContainer';
import type { ContributionType } from 'helpers/contributions';
import type { IsoCountry } from 'helpers/internationalisation/country';
import { fromCountry } from 'helpers/internationalisation/countryGroup';

interface StripePaymentRequestButtonProps {
	country: IsoCountry;
	isTestUser: boolean;
	contributionType: ContributionType;
	amount: number;
}

function StripePaymentRequestButton({
	country,
	isTestUser,
	contributionType,
	amount,
}: StripePaymentRequestButtonProps): JSX.Element {
	return (
		<StripePaymentRequestButtonContainer
			country={country}
			isTestUser={isTestUser}
			contributionType={contributionType}
			amount={amount}
			renderPaymentRequestButton={({
				type,
				paymentRequest,
				paymentRequestError,
				onStripeButtonClick,
				onCustomButtonClick,
			}) => (
				<PaymentRequestButton
					country={country}
					contributionType={contributionType}
					type={type}
					paymentRequest={paymentRequest}
					paymentRequestError={paymentRequestError}
					onStripeButtonClick={onStripeButtonClick}
					onCustomButtonClick={onCustomButtonClick}
				/>
			)}
		/>
	);
}

// ---- Helper component ---- //

interface PaymentRequestButtonProps extends RenderPaymentRequestButtonInput {
	country: IsoCountry;
	contributionType: ContributionType;
}

function PaymentRequestButton({
	country,
	contributionType,
	type,
	paymentRequest,
	paymentRequestError,
	onStripeButtonClick,
	onCustomButtonClick,
}: PaymentRequestButtonProps) {
	const countryGroupId = fromCountry(country);

	const isUkOrEuRecurring =
		contributionType !== 'ONE_OFF' &&
		(countryGroupId === 'GBPCountries' || countryGroupId === 'EURCountries');

	const shouldRenderStripeElement =
		type === 'APPLE_PAY' || type === 'GOOGLE_PAY';

	const shouldShow = shouldRenderStripeElement || !isUkOrEuRecurring;

	if (!shouldShow) {
		return null;
	}

	return (
		<>
			{shouldRenderStripeElement ? (
				<div css={styles.paymentRequestButtonContainer}>
					<PaymentRequestButtonElement
						options={{
							paymentRequest,
							style: styles.stripeButton,
						}}
						onClick={onStripeButtonClick}
					/>
				</div>
			) : (
				<div>
					<Button onClick={onCustomButtonClick} css={styles.customButton}>
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
	stripeButton: {
		paymentRequestButton: {
			theme: 'dark',
			height: '42px',
		},
	} as const,
	paymentRequestButtonContainer: css`
		margin: ${space[5]}px 0;

		${from.desktop} {
			margin: ${space[6]}px 0;
		}
	`,
	customButton: css`
		width: 100%;
		justify-content: center;
		margin: ${space[5]}px 0;
		background: #323457;

		&:hover {
			background: #1c1d31;
		}

		${from.desktop} {
			margin: ${space[6]}px 0;
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
