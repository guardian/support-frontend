import { css } from '@emotion/react';
import { body, from, space } from '@guardian/source-foundations';
import type { ContributionType } from 'helpers/contributions';
import { type IsoCurrency } from 'helpers/internationalisation/currency';
import type { Promotion } from 'helpers/productPrice/promotions';
import type { UserTypeFromIdentityResponse } from 'helpers/redux/checkout/personalDetails/state';
import DirectDebitMessage from './directDebitMessage';
import Heading from './heading';
import Subheading, { OfferHeading } from './subheading';

export const header = css`
	background: white;
	padding-top: ${space[4]}px;
	padding-bottom: ${space[5]}px;

	${from.tablet} {
		background: none;
	}
`;

export const headerSupportingText = css`
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
	amount: number | undefined;
	currency: IsoCurrency;
	amountIsAboveThreshold: boolean;
	isSignedIn: boolean;
	userTypeFromIdentityResponse: UserTypeFromIdentityResponse;
	promotion?: Promotion;
	showOffer?: boolean;
};

function ThankYouHeader({
	name,
	showDirectDebitMessage,
	isOneOffPayPal,
	contributionType,
	amount,
	currency,
	amountIsAboveThreshold,
	isSignedIn,
	userTypeFromIdentityResponse,
	showOffer,
	promotion,
}: ThankYouHeaderProps): JSX.Element {
	return (
		<header css={header}>
			<Heading
				name={name}
				isOneOffPayPal={isOneOffPayPal}
				amount={amount}
				promotion={promotion}
				currency={currency}
				contributionType={contributionType}
			/>

			<p css={headerSupportingText}>
				{showDirectDebitMessage && <DirectDebitMessage />}
				<Subheading
					contributionType={contributionType}
					amountIsAboveThreshold={amountIsAboveThreshold}
					isSignedIn={isSignedIn}
					userTypeFromIdentityResponse={userTypeFromIdentityResponse}
				/>
			</p>
			{showOffer && (
				<p css={headerSupportingText}>
					<OfferHeading />
				</p>
			)}
		</header>
	);
}

export default ThankYouHeader;
