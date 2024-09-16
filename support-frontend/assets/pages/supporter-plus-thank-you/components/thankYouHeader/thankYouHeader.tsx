import { css } from '@emotion/react';
import { from, space, textEgyptian15 } from '@guardian/source/foundations';
import type { ContributionType } from 'helpers/contributions';
import { type IsoCurrency } from 'helpers/internationalisation/currency';
import type { Promotion } from 'helpers/productPrice/promotions';
import type { UserTypeFromIdentityResponse } from 'helpers/redux/checkout/personalDetails/state';
import DirectDebitMessage from './directDebitMessage';
import Heading from './heading';
import Subheading, { OfferHeading } from './subheading';

export const header = css`
	background: white;
	padding: ${space[4]}px 10px ${space[5]}px;
	${from.tablet} {
		padding-left: 0px;
		padding-right: 0px;
		background: none;
	}
`;

export const headerSupportingText = css`
	${textEgyptian15};
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
	isTier3: boolean;
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
	isTier3,
}: ThankYouHeaderProps): JSX.Element {
	return (
		<header css={header}>
			<Heading
				name={name}
				isOneOffPayPal={isOneOffPayPal}
				isTier3={isTier3}
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
					isTier3={isTier3}
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
