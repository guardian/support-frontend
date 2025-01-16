import { css } from '@emotion/react';
import { space } from '@guardian/source/foundations';
import type { ContributionType } from 'helpers/contributions';
import type { PaymentStatus } from 'helpers/forms/paymentMethods';
import {
	type ActiveProductKey,
	productCatalogDescription,
} from 'helpers/productCatalog';
import type { UserType } from 'helpers/redux/checkout/personalDetails/state';

interface SubheadingProps {
	contributionType: ContributionType;
	productKey: ActiveProductKey;
	amountIsAboveThreshold: boolean;
	isSignedIn: boolean;
	identityUserType: UserType;
	paymentStatus?: PaymentStatus;
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

const pendingCopy = () => {
	return (
		<p
			css={css`
				padding-bottom: ${space[3]}px;
			`}
		>
			{`Thankyou for subscribing to a recurring subscription. Your subscription is being processed and you will receive an email when your account is live.`}
		</p>
	);
};

const getSubHeadingCopy = (
	productKey: ActiveProductKey,
	amountIsAboveThreshold: boolean,
	contributionType: ContributionType,
	isSignedIn: boolean,
	identityUserType: UserType,
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
		const signedInBelowThreshold = `Look out for your exclusive newsletter from our supporter editor.
						We’ll also be in touch with other great ways to get closer to
						Guardian journalism.${' '}`;
		const notSignedInCopy = (
			<span>
				{productCatalogDescription[productKey].thankyouMessage ??
					signedInBelowThreshold}
			</span>
		);
		const signedInCopy = amountIsAboveThreshold ? (
			<>
				{signedInAboveThreshold}
				{notSignedInCopy}
			</>
		) : (
			notSignedInCopy
		);
		return {
			isSignedIn: signedInCopy,
			notSignedIn: notSignedInCopy,
		};
	};

	return (
		contributionType !== 'ONE_OFF' &&
		recurringCopy(amountIsAboveThreshold)[
			identityUserType === 'current' || isSignedIn
				? 'isSignedIn'
				: 'notSignedIn'
		]
	);
};

function Subheading({
	contributionType,
	productKey,
	amountIsAboveThreshold,
	isSignedIn,
	identityUserType,
	paymentStatus,
}: SubheadingProps): JSX.Element {
	const isTier3 = productKey === 'TierThree';
	const isGuardianAdLite =
		productKey === 'GuardianLight' || productKey === 'GuardianAdLite';
	const subheadingCopy = getSubHeadingCopy(
		productKey,
		amountIsAboveThreshold,
		contributionType,
		isSignedIn,
		identityUserType,
	);
	const isPending = paymentStatus === 'pending';
	return (
		<>
			{isPending && pendingCopy()}
			{subheadingCopy}
			{!isGuardianAdLite && !isPending && (
				<>
					<MarketingCopy
						contributionType={contributionType}
						isTier3={isTier3}
					/>
					{identityUserType !== 'current' &&
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
