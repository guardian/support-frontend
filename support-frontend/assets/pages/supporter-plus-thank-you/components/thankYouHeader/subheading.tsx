import { css } from '@emotion/react';
import type { ContributionType } from 'helpers/contributions';
import type { UserTypeFromIdentityResponse } from 'helpers/redux/checkout/personalDetails/state';

interface SubheadingProps {
	contributionType: ContributionType;
	amountIsAboveThreshold: boolean;
	isSignedIn: boolean;
	userTypeFromIdentityResponse: UserTypeFromIdentityResponse;
}

function MarketingCopy({
	contributionType,
}: {
	contributionType: ContributionType;
}) {
	return (
		<span>
			{contributionType === 'ONE_OFF'
				? 'Thank you for your contribution. We’ll be in touch to bring you closer to our journalism. You can amend your email preferences at any time via '
				: 'Adjust your email preferences at any time via '}
			<a href="https://manage.theguardian.com">your account</a>.
		</span>
	);
}

const getSubHeadingCopy = (
	amountIsAboveThreshold: boolean,
	contributionType: ContributionType,
	isSignedIn: boolean,
	userTypeFromIdentityResponse: UserTypeFromIdentityResponse,
) => {
	const recurringCopy = (amountIsAboveThreshold: boolean) => {
		return {
			isSignedIn: amountIsAboveThreshold ? (
				<>
					<span
						css={css`
							font-weight: bold;
						`}
					>
						You have unlocked your exclusive supporter extras – we hope you
						enjoy them.
					</span>{' '}
					<span>
						Look out for your exclusive newsletter from our supporter editor.
						We’ll also be in touch with other great ways to get closer to
						Guardian journalism.{' '}
					</span>
				</>
			) : (
				<span>
					Look out for your exclusive newsletter from our supporter editor.
					We’ll also be in touch with other great ways to get closer to Guardian
					journalism.{' '}
				</span>
			),
			notSignedIn: amountIsAboveThreshold ? (
				<span>
					Look out for your exclusive newsletter from our supporter editor.
					We’ll also be in touch with other great ways to get closer to Guardian
					journalism.{' '}
				</span>
			) : (
				<span>
					Look out for your exclusive newsletter from our supporter editor.
					We’ll also be in touch with other great ways to get closer to Guardian
					journalism.{' '}
				</span>
			),
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
	isSignedIn,
	userTypeFromIdentityResponse,
}: SubheadingProps): JSX.Element {
	const subheadingCopy = getSubHeadingCopy(
		amountIsAboveThreshold,
		contributionType,
		isSignedIn,
		userTypeFromIdentityResponse,
	);

	return (
		<>
			{subheadingCopy}
			<MarketingCopy contributionType={contributionType} />
			{userTypeFromIdentityResponse !== 'current' &&
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
