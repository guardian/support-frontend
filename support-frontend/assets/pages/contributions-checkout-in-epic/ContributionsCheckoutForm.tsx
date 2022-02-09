import type { SerializedStyles } from '@emotion/react';
import { css, ThemeProvider } from '@emotion/react';
import { neutral, space } from '@guardian/source-foundations';
import {
	Button,
	buttonThemeReaderRevenue,
	LinkButton,
} from '@guardian/source-react-components';
import { PaymentRequestButtonElement } from '@stripe/react-stripe-js';
import { useState } from 'react';
import * as React from 'react';
import StripePaymentRequestButtonContainer from 'components/StripePaymentRequestButton/StripePaymentRequestButtonContainer';
import SvgArrowRightStraight from 'components/svgs/arrowRightStraight';
import type {
	ContributionAmounts,
	ContributionType,
	OtherAmounts,
	SelectedAmounts,
} from 'helpers/contributions';
import { getAmount } from 'helpers/contributions';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import { ContributionAmountSelector } from './ContributionAmountSelector';
import { ContributionTypeSelector } from './ContributionTypeSelector';
import type { SecondaryCta } from './useSecondaryCta';
import { SecondaryCtaType } from './useSecondaryCta';

// ---- Component ---- //

interface ContributionsCheckoutFormProps {
	country: string;
	countryGroupId: CountryGroupId;
	currency: IsoCurrency;
	contributionType: ContributionType;
	amounts: ContributionAmounts;
	selectedAmounts: SelectedAmounts;
	otherAmounts: OtherAmounts;
	setSelectedContributionType: (contributionType: ContributionType) => void;
	setSelectedAmount: (amount: number | 'other') => void;
	setOtherAmount: (amount: string) => void;
	secondaryCta: SecondaryCta;
	isTestUser: boolean;
}

export function ContributionsCheckoutForm({
	country,
	countryGroupId,
	currency,
	contributionType,
	amounts,
	selectedAmounts,
	otherAmounts,
	setSelectedContributionType,
	setSelectedAmount,
	setOtherAmount,
	secondaryCta,
	isTestUser,
}: ContributionsCheckoutFormProps): JSX.Element {
	const [shouldShowErrorMessage, setShouldShowErrorMessage] = useState(false);

	const amount = getAmount(selectedAmounts, otherAmounts, contributionType);

	function onAlternativePaymentButtonClicked(
		event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
	) {
		event.preventDefault();

		if (window.top) {
			window.top.location.href = getSupportUrl(contributionType, amount);
		}
	}

	const shouldHideFallbackCtas =
		secondaryCta.type === SecondaryCtaType.Reminder &&
		secondaryCta.isReminderActive;

	return (
		<div>
			<ContributionTypeSelector
				contributionType={contributionType}
				onSelectContributionType={(contributionType) => {
					setShouldShowErrorMessage(false);
					setSelectedContributionType(contributionType);
				}}
			/>

			<ContributionAmountSelector
				contributionType={contributionType}
				countryGroupId={countryGroupId}
				currency={currency}
				amounts={amounts}
				selectedAmounts={selectedAmounts}
				otherAmounts={otherAmounts}
				shouldShowOtherAmountErrorMessage={shouldShowErrorMessage}
				setSelectedAmount={(amount) => {
					setShouldShowErrorMessage(false);
					setSelectedAmount(amount);
				}}
				setOtherAmount={(amount) => {
					setShouldShowErrorMessage(false);
					setOtherAmount(amount);
				}}
			/>

			<div css={styles.prbContainer}>
				<StripePaymentRequestButtonContainer
					country={country}
					contributionType={contributionType}
					isTestUser={isTestUser}
					amount={amount}
					renderPaymentRequestButton={({
						paymentRequest,
						onStripeButtonClick,
						onCustomButtonClick,
						type,
					}) => (
						<div css={styles.ctasContainer}>
							<div css={styles.primaryCtaContainer}>
								{type === 'PAY_NOW' ? (
									<Button
										onClick={(e) => {
											setShouldShowErrorMessage(true);
											onCustomButtonClick(e);
										}}
										css={styles.customPrb}
									>
										Pay with saved card
									</Button>
								) : (
									<PaymentRequestButtonElement
										options={{ paymentRequest }}
										onClick={(e) => {
											setShouldShowErrorMessage(true);
											onStripeButtonClick(e);
										}}
									/>
								)}
							</div>

							<div css={styles.secondaryCtaContainer}>
								<ThemeProvider theme={buttonThemeReaderRevenue}>
									<LinkButton
										href={getSupportUrl(contributionType, amount)}
										onClick={onAlternativePaymentButtonClicked}
										cssOverrides={styles.secondaryCta}
									>
										<div css={styles.secondaryCtaContentsContainer}>
											<div>
												<PaymentIcons cssOverrides={styles.paymentIconsIn} />
											</div>
											<div>Pay another way</div>
										</div>
									</LinkButton>
								</ThemeProvider>
							</div>
						</div>
					)}
					renderFallback={() => (
						<>
							{!shouldHideFallbackCtas && (
								<FallbackCtas
									contributionType={contributionType}
									amount={amount}
									onPrimaryCtaClicked={onAlternativePaymentButtonClicked}
									secondaryCta={secondaryCta}
								/>
							)}
						</>
					)}
				/>
			</div>
		</div>
	);
}

// ---- Helper components ---- //

interface FallbackCtasProps {
	contributionType: ContributionType;
	amount: number;
	onPrimaryCtaClicked: (
		event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
	) => void;
	secondaryCta: SecondaryCta;
}

function FallbackCtas({
	contributionType,
	amount,
	onPrimaryCtaClicked,
	secondaryCta,
}: FallbackCtasProps) {
	return (
		<div css={styles.fallbackCtasContainer}>
			<div>
				<ThemeProvider theme={buttonThemeReaderRevenue}>
					<LinkButton
						href={getSupportUrl(contributionType, amount)}
						onClick={onPrimaryCtaClicked}
						icon={<SvgArrowRightStraight />}
						iconSide="right"
						nudgeIcon
						cssOverrides={styles.supportCta}
					>
						Support the Guardian
					</LinkButton>
				</ThemeProvider>

				<div css={styles.paymentIconsContainer}>
					<PaymentIcons cssOverrides={styles.paymentIcons} />
				</div>
			</div>

			{secondaryCta.type === SecondaryCtaType.Reminder && (
				<Button
					onClick={secondaryCta.onReminderCtaClicked}
					priority="tertiary"
					cssOverrides={styles.reminderCta}
				>
					{secondaryCta.reminderCta}
				</Button>
			)}
		</div>
	);
}

function PaymentIcons(props: { cssOverrides?: SerializedStyles }) {
	return (
		<img
			width={422}
			height={60}
			src="https://assets.guim.co.uk/images/acquisitions/2db3a266287f452355b68d4240df8087/payment-methods.png"
			alt="Accepted payment methods: Visa, Mastercard, American Express and PayPal"
			css={props.cssOverrides}
		/>
	);
}

// ---- Helpers ---- //

const BASE_URL = 'https://support.theguardian.com/contribute';

function getSupportUrl(
	contributionType: ContributionType,
	amount: number,
): string {
	// The query params coming from SDC contain all of the tracking data
	// for the A/B test. We forward all of this on to the support site
	// in order to track the participations correctly.
	const tracking = window.location.search.slice(1);

	return `${BASE_URL}?selected-contribution-type=${contributionType}&selected-amount=${amount}&${tracking}`;
}

// ---- Styles ---- //

// We have a custom breakpoint here to accomodate the width of the
// fallback CTAs. More generally, as this page is embedded in the
// Epic the widths actually refer to the width of the iframe container
// in the epic, not the page itself. This means the breakpoints from
// source are less useful and it's less bad to have our own custom one.
const CTAS_BREAKPOINT = '520px';

export const styles = {
	prbContainer: css`
		margin-top: ${space[6]}px;
	`,
	ctasContainer: css`
		display: flex;
		flex-direction: column;

		@media (min-width: ${CTAS_BREAKPOINT}) {
			flex-direction: row;
			align-items: center;
		}
	`,
	primaryCtaContainer: css`
		@media (min-width: ${CTAS_BREAKPOINT}) {
			width: calc(50% - 2px);
		}
	`,
	secondaryCtaContainer: css`
		margin-top: ${space[2]}px;
		display: flex;
		justify-content: center;

		@media (min-width: ${CTAS_BREAKPOINT}) {
			margin-top: 0;
			margin-left: ${space[2]}px;
		}
	`,
	secondaryCta: css`
		color: ${neutral[7]};
		width: 100%;
	`,
	secondaryCtaContentsContainer: css`
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
	`,
	customPrb: css`
		width: 100%;
		justify-content: center;
		background: #323457;

		&:hover {
			background: #1c1d31;
		}
	`,
	supportCta: css`
		color: ${neutral[7]};
	`,
	fallbackCtasContainer: css`
		display: flex;
	`,
	reminderCta: css`
		margin-left: ${space[2]}px;
		color: ${neutral[7]};
		border-color: ${neutral[7]};
	`,
	paymentIconsContainer: css`
		margin-top: ${space[2]}px;
	`,
	paymentIcons: css`
		height: 25px;
		width: auto;
	`,
	paymentIconsIn: css`
		height: 17px;
		width: auto;
		display: block;
		margin-right: ${space[2]}px;
	`,
};
