import { css } from '@emotion/react';
import { body, from, space, titlepiece } from '@guardian/source-foundations';
import * as React from 'react';
import type { ContributionType } from 'helpers/contributions';
import { formatAmount } from 'helpers/forms/checkouts';
import type { PaymentMethod } from 'helpers/forms/paymentMethods';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import {
	currencies,
	spokenCurrencies,
} from 'helpers/internationalisation/currency';

const header = css`
	background: white;
	padding-top: ${space[4]}px;
	padding-bottom: ${space[5]}px;

	${from.tablet} {
		background: none;
	}
`;
const headerTitleText = css`
	${titlepiece.small()};
	font-size: 24px;

	${from.tablet} {
		font-size: 40px;
	}
`;
const headerSupportingText = css`
	${body.small()};
	padding-top: ${space[3]}px;

	${from.tablet} {
		font-size: 17px;
	}
`;
const directDebitSetupText = css`
	font-weight: bold;
`;
const amountText = css`
	background-color: #ffe500;
	padding: 0 5px;
`;
type ContributionThankYouHeaderProps = {
	name: string | null;
	showDirectDebitMessage: boolean;
	paymentMethod: PaymentMethod;
	contributionType: ContributionType;
	amount: number;
	currency: IsoCurrency;
	shouldShowLargeDonationMessage: boolean;
	showNewProductThankYouText: boolean;
};
const MAX_DISPLAY_NAME_LENGTH = 10;

function ContributionThankYouHeader({
	name,
	showDirectDebitMessage,
	paymentMethod,
	contributionType,
	amount,
	currency,
	shouldShowLargeDonationMessage,
	showNewProductThankYouText,
}: ContributionThankYouHeaderProps): JSX.Element {
	const title = (): React.ReactNode => {
		const nameAndTrailingSpace: string =
			name && name.length < MAX_DISPLAY_NAME_LENGTH ? `${name} ` : '';
		// Do not show special header to paypal/one-off as we don't have the relevant info after the redirect
		const payPalOneOff =
			paymentMethod === 'PayPal' && contributionType === 'ONE_OFF';

		if (!payPalOneOff && amount) {
			const currencyAndAmount = (
				<span css={amountText}>
					{formatAmount(
						currencies[currency],
						spokenCurrencies[currency],
						amount,
						false,
					)}
				</span>
			);

			switch (contributionType) {
				case 'ONE_OFF':
					return (
						<div>
							Thank you for supporting us today with {currencyAndAmount} ❤️
						</div>
					);

				case 'MONTHLY':
					return (
						<div>
							Thank you {nameAndTrailingSpace}for{' '}
							{showNewProductThankYouText
								? 'supporting us with'
								: 'choosing to contribute'}{' '}
							{currencyAndAmount} each month ❤️
						</div>
					);

				case 'ANNUAL':
					return (
						<div>
							Thank you {nameAndTrailingSpace}for{' '}
							{showNewProductThankYouText
								? 'supporting us with'
								: 'choosing to contribute'}{' '}
							{currencyAndAmount} each year ❤️
						</div>
					);

				default:
					return (
						<div>
							Thank you {nameAndTrailingSpace}for your valuable contribution
						</div>
					);
			}
		} else {
			return (
				<div>
					Thank you {nameAndTrailingSpace}for your valuable contribution
				</div>
			);
		}
	};

	function AdditionalCopy() {
		const mainText = shouldShowLargeDonationMessage
			? 'It’s not every day we receive such a generous contribution – thank you. We’ll be in touch to bring you closer to our journalism. Please select the extra add-ons that suit you best. '
			: 'To support us further, and enhance your experience with the Guardian, select the add-ons that suit you best. As you’re now a valued supporter, we’ll be in touch to bring you closer to our journalism. ';

		const benefitsThresholdIsMetText =
			'You have unlocked access to the Guardian’s digital subscription, offering you the best possible experience of our independent journalism. Look out for emails from us shortly, so you can activate your exclusive extras. In the meantime, please select the add-ons that suit you best.';

		function MarketingCopy() {
			return (
				<span>
					You can amend your email preferences at any time via{' '}
					<a href="https://manage.theguardian.com">your account</a>.
				</span>
			);
		}

		return (
			<>
				{showNewProductThankYouText ? benefitsThresholdIsMetText : mainText}
				{!showNewProductThankYouText && contributionType !== 'ONE_OFF' && (
					<MarketingCopy />
				)}
			</>
		);
	}

	return (
		<header css={header}>
			<h1 css={headerTitleText}>{title()}</h1>
			<p css={headerSupportingText}>
				{showDirectDebitMessage && (
					<>
						<span css={directDebitSetupText}>
							Your Direct Debit has been set up.{' '}
						</span>
						Look out for an email within three business days confirming your
						recurring payment. This will appear as &apos;Guardian Media
						Group&apos; on your bank statements.
						<br />
						<br />
					</>
				)}
				<AdditionalCopy />
			</p>
		</header>
	);
}

export default ContributionThankYouHeader;
