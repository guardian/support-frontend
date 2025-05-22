import { css } from '@emotion/react';
import { space } from '@guardian/source/foundations';
import type { PaymentStatus } from 'helpers/forms/paymentMethods';
import {
	type ActiveProductKey,
	type ActiveRatePlanKey,
	productCatalogDescription,
} from 'helpers/productCatalog';
import type { UserType } from 'helpers/redux/checkout/personalDetails/state';
import { ObserverPrint } from 'pages/paper-subscription-landing/helpers/products';

interface SubheadingProps {
	productKey: ActiveProductKey;
	ratePlanKey: ActiveRatePlanKey;
	amountIsAboveThreshold: boolean;
	isSignedIn: boolean;
	identityUserType: UserType;
	observerPrint?: ObserverPrint;
	startDate?: string;
	paymentStatus?: PaymentStatus;
}

function MarketingCopy({
	ratePlanKey,
	isTier3,
	isPaper,
}: {
	ratePlanKey: ActiveRatePlanKey;
	isTier3: boolean;
	isPaper: boolean;
}) {
	return (
		<span>
			{ratePlanKey === 'OneTime'
				? 'Thank you for your contribution. We’ll be in touch to bring you closer to our journalism. You can amend your email preferences at any time via '
				: isTier3
				? 'You can adjust your email preferences and opt out anytime via '
				: isPaper
				? 'You can opt out any time via your '
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
			Thank you for subscribing to a recurring subscription. Your subscription
			is being processed and you will receive an email when your account is
			live.
		</p>
	);
};

const getSubHeadingCopy = (
	productKey: ActiveProductKey,
	ratePlanKey: ActiveRatePlanKey,
	amountIsAboveThreshold: boolean,
	isSignedIn: boolean,
	identityUserType: UserType,
	observerPrint?: ObserverPrint,
	startDate?: string,
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

		const getThankyouMessage = (): string | undefined => {
			if (observerPrint === ObserverPrint.SubscriptionCard) {
				return 'You should receive your subscription card in 1-2 weeks, but look out for an email landing in your inbox later today containing details of how you can pick up your newspaper before then.';
			}
			if (observerPrint === ObserverPrint.Paper) {
				return startDate
					? `You will receive your newspapers from ${startDate}.`
					: undefined;
			}
			return productCatalogDescription[productKey].thankyouMessage;
		};
		const thankyouMessage = getThankyouMessage();

		const signedInBelowThreshold = `Look out for your exclusive newsletter from our supporter editor.
						We’ll also be in touch with other great ways to get closer to
						Guardian journalism.${' '}`;
		const notSignedInCopy = (
			<span>{thankyouMessage ?? signedInBelowThreshold}</span>
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
		ratePlanKey !== 'OneTime' &&
		recurringCopy(amountIsAboveThreshold)[
			identityUserType === 'current' || isSignedIn
				? 'isSignedIn'
				: 'notSignedIn'
		]
	);
};

function Subheading({
	productKey,
	ratePlanKey,
	amountIsAboveThreshold,
	isSignedIn,
	observerPrint,
	identityUserType,
	paymentStatus,
	startDate,
}: SubheadingProps): JSX.Element {
	const paperProductsKeys: ActiveProductKey[] = [
		'NationalDelivery',
		'HomeDelivery',
		'SubscriptionCard',
	];
	const isPaper = paperProductsKeys.includes(productKey);
	const isTier3 = productKey === 'TierThree';
	const isGuardianAdLite = productKey === 'GuardianAdLite';
	const subheadingCopy = getSubHeadingCopy(
		productKey,
		ratePlanKey,
		amountIsAboveThreshold,
		isSignedIn,
		identityUserType,
		observerPrint,
		startDate,
	);
	const isPending = paymentStatus === 'pending';
	return (
		<>
			{isPending && !isPaper && pendingCopy()}
			{subheadingCopy}
			{!isGuardianAdLite && !isPending && !observerPrint && (
				<>
					<MarketingCopy
						ratePlanKey={ratePlanKey}
						isTier3={isTier3}
						isPaper={isPaper}
					/>
					{identityUserType !== 'current' &&
						!isTier3 &&
						ratePlanKey !== 'OneTime' && (
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
