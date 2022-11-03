import { css } from '@emotion/react';
import { body, from, space, titlepiece } from '@guardian/source-foundations';
import type { ContributionType } from 'helpers/contributions';
import type { UserTypeFromIdentityResponse } from 'helpers/identityApis';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import DirectDebitMessage from './directDebitMessage';
import Heading from './heading';
import Subheading from './subheading';

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

type ThankYouHeaderProps = {
	name: string | null;
	showDirectDebitMessage: boolean;
	isOneOffPayPal: boolean;
	contributionType: ContributionType;
	amount: number;
	currency: IsoCurrency;
	shouldShowLargeDonationMessage: boolean;
	amountIsAboveThreshold: boolean;
	isSignedIn: boolean;
	userTypeFromIdentityResponse: UserTypeFromIdentityResponse;
};

function ThankYouHeader({
	name,
	showDirectDebitMessage,
	isOneOffPayPal,
	contributionType,
	amount,
	currency,
	shouldShowLargeDonationMessage,
	amountIsAboveThreshold,
	isSignedIn,
	userTypeFromIdentityResponse,
}: ThankYouHeaderProps): JSX.Element {
	return (
		<header css={header}>
			<h1 css={headerTitleText}>
				<Heading
					name={name}
					isOneOffPayPal={isOneOffPayPal}
					amount={amount}
					currency={currency}
					contributionType={contributionType}
				/>
			</h1>
			<p css={headerSupportingText}>
				{showDirectDebitMessage && <DirectDebitMessage />}
				<Subheading
					shouldShowLargeDonationMessage={shouldShowLargeDonationMessage}
					contributionType={contributionType}
					amountIsAboveThreshold={amountIsAboveThreshold}
					isSignedIn={isSignedIn}
					userTypeFromIdentityResponse={userTypeFromIdentityResponse}
				/>
			</p>
		</header>
	);
}

export default ThankYouHeader;
