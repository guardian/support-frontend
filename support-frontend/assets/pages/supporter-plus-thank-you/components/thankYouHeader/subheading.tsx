import { css } from '@emotion/react';
import type { ContributionType } from 'helpers/contributions';
import type { UserTypeFromIdentityResponse } from 'helpers/redux/checkout/personalDetails/state';

interface SubheadingProps {
	contributionType: ContributionType;
	amountIsAboveThreshold: boolean;
	isTier3: boolean;
	isSignedIn: boolean;
	userTypeFromIdentityResponse: UserTypeFromIdentityResponse;
}

function MarketingCopy({
	contributionType,
	isTier3,
}: {
	contributionType: ContributionType;
	isTier3: boolean;
}) {
	return (
		<span>
			{contributionType === 'ONE_OFF'
				? 'Thank you for your contribution. We’ll be in touch to bring you closer to our journalism. You can amend your email preferences at any time via '
				: isTier3
				? 'You can adjust your email preferences and opt out anytime via '
				: 'Adjust your email preferences at any time via '}
			<a href="https://manage.theguardian.com">your account</a>.
		</span>
	);
}

const getSubHeadingCopy = (
	amountIsAboveThreshold: boolean,
	contributionType: ContributionType,
	isTier3: boolean,
	isSignedIn: boolean,
	userTypeFromIdentityResponse: UserTypeFromIdentityResponse,
) => {
	const recurringCopy = (amountIsAboveThreshold: boolean) => {
		const signedInAboveThreshold = (
			<span
				css={css`
					font-weight: bold;
				`}
			>
				{`You have unlocked your exclusive supporter extras – we hope you	enjoy them.${' '}`}
			</span>
		);
		const signedInBelowThreshold = (
			<span>{`Look out for your exclusive newsletter from our supporter editor.
						We’ll also be in touch with other great ways to get closer to
						Guardian journalism.${' '}`}</span>
		);
		const tier3HeadingCopy = (
			<span>{`You'll receive a confirmation email containing everything you need to know about your subscription, including additional emails on how to make the most of your subscription.${' '}`}</span>
		);
		return {
			isSignedIn: isTier3 ? (
				<>{tier3HeadingCopy}</>
			) : amountIsAboveThreshold ? (
				<>
					{signedInAboveThreshold}
					{signedInBelowThreshold}
				</>
			) : (
				<>{signedInBelowThreshold}</>
			),
			notSignedIn: <>{isTier3 ? tier3HeadingCopy : signedInBelowThreshold}</>,
		};
	};

	return (
		contributionType !== 'ONE_OFF' &&
		recurringCopy(amountIsAboveThreshold)[
			userTypeFromIdentityResponse === 'current' || isSignedIn
				? 'isSignedIn'
				: 'notSignedIn'
		]
	);
};

function Subheading({
	contributionType,
	amountIsAboveThreshold,
	isTier3,
	isSignedIn,
	userTypeFromIdentityResponse,
}: SubheadingProps): JSX.Element {
	const subheadingCopy = getSubHeadingCopy(
		amountIsAboveThreshold,
		contributionType,
		isTier3,
		isSignedIn,
		userTypeFromIdentityResponse,
	);

	return (
		<>
			{subheadingCopy}
			<MarketingCopy contributionType={contributionType} isTier3={isTier3} />
			{userTypeFromIdentityResponse !== 'current' &&
				!isTier3 &&
				contributionType !== 'ONE_OFF' && (
					<span
						css={css`
							font-weight: bold;
						`}
					>
						{' '}
						In the meantime, please sign in to get the best supporter
						experience.
					</span>
				)}
		</>
	);
}

export function OfferHeading(): JSX.Element {
	return (
		<>
			<div
				css={css`
					font-weight: bold;
				`}
			>
				We will email you within 24 hours with a unique promo code and
				instructions for how to redeem your free book from Tertulia.
			</div>
			<span>
				To preview the list of books, click{' '}
				<a href="https://tertulia.com/editorial-list/guardian-editors-gift-books-for-supporters">
					here.
				</a>{' '}
				(Remember, you will not be able to claim your free book until you
				receive your promo code.)
			</span>
		</>
	);
}

export default Subheading;
